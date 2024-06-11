import { TipoCliente } from './../../utils/clases/usuarios/cliente';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonFab, IonIcon, IonFabButton, IonFabList, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonButton, IonImg, IonRadioGroup, IonRadio } from '@ionic/angular/standalone';
import { Cliente } from 'src/app/utils/clases/usuarios/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MySwal } from 'src/app/utils/alerts';
import { Barcode } from '@capacitor-mlkit/barcode-scanning';

const datePipe = new DatePipe('en-US', '-0300');

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonRadio, IonRadioGroup, IonImg, IonButton, IonItem, IonLabel, IonCol, IonRow, IonGrid, IonFabList, IonFabButton,
    IonIcon, IonFab, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,ReactiveFormsModule]
})
export class AltaClientePage implements OnInit {
  storageName: string = Colecciones.Usuarios;
  @Input({ required: true }) newPicPrefix!: string;

  picture!: File;
  tipoCliente: TipoCliente = 'registrado';

  frmCliente: FormGroup;
  nombre = new FormControl('', [Validators.required]);
  apellido = new FormControl('');
  DNI = new FormControl(0);
  email = new FormControl('', [Validators.email]);

  nombreErrorMessage: string = '';
  apellidoErrorMessage: string = '';
  DNIErrorMessage: string = '';
  emailErrorMessage: string = '';

  isSupported = false;
  pressedButton: boolean = false;
  scanActive: boolean = false;

  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private scanService: ScannerService
  ) {
    this.frmCliente = this.formBuilder.group({
      nombre: this.nombre,
      apellido: this.apellido,
      DNI: this.DNI,
      email: this.email,
    });
  }

  readonly supportedImageFormats = ['jpg', 'jpeg', 'png'];

  ngOnInit() {
    this.scanService.isScannerSupported().then((supported) => {
      this.isSupported = supported; // Usa ScanService para verificar la compatibilidad del escáner
    });
  }
  fillFields() {
    this.nombre.setValue('Nombre');
    this.apellido.setValue('Apellido');
    this.DNI.setValue(12345);
    this.email.setValue('email@example.com');
  }

  updateErrorMessage(frmControl: FormControl) {
    if (frmControl.hasError('required')) {
      if (frmControl === this.nombre) {
        this.nombreErrorMessage = 'Este campo es obligatorio';
      }
    } else if (frmControl.hasError('email')) {
      this.emailErrorMessage = 'El formato es incorrecto';
    }
  }

  async takePic() {
    try {
      let proceed: boolean = false;

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      if (!this.supportedImageFormats.includes(image.format)) {
        throw new Error('El archivo debe ser de formato .JPG, .JPEG o .PNG');
      }

      await MySwal.fire({
        text: '¿Esta foto desea subir?',
        imageUrl: image.webPath,
        imageWidth: '75vw',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        confirmButtonColor: '#a5dc86',
        showDenyButton: true,
        denyButtonText: 'No',
        denyButtonColor: '#f27474',
        showCancelButton: true,
        cancelButtonText: 'Volver a tomar esta foto',
        cancelButtonColor: '#f0ec0d',
      }).then(async (res) => {
        proceed = !res.isDenied;
        const imgFile = await this.getFileFromUri(image.webPath!, image.format);
        this.picture = imgFile;
      });
    } catch (er: any) {
      if (er.message === 'User cancelled photos app') {
        // ToastInfo.fire('Operación cancelada.');
      } else {
        // await MySwal.fire('Algo salió mal.', er.message, 'error');
        throw er;
      }
    }
  }

  private async getFileFromUri(fileUri: string, fileFormat: string): Promise<File> {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const file = new File([blob], 'photo.jpg', { type: 'image/' + fileFormat });
    return file;
  }

  async uploadPicture(image: File) {
    const datetime: Date = new Date();
    const dateStr: string = datePipe.transform(datetime, 'yyyyMMdd-HHmmss')!;
    const nombreFoto: string = `${this.nombre.value}-${this.apellido.value}-${dateStr}`;

    try {
      const url = await this.storage.subirArchivo(
        image,
        `${this.storageName}/${this.newPicPrefix}-${nombreFoto}`
      );
      const fotoDePerfil = {
        id: '',
        name: nombreFoto,
        date: datetime,
        url: url,
      };
      console.log(fotoDePerfil);
      await this.db.subirDoc(this.storageName, fotoDePerfil, true);
      return url;
    } catch (error: any) {
      return null;
    }
  }

  async subirCliente() {
    let foto = await this.uploadPicture(this.picture);

    if (foto) {
      let cliente = new Cliente(
        '',
        this.nombre.value!,
        this.apellido.value!,
        this.DNI.value ? Number(this.DNI.value) : 0,
        foto,
        this.email.value || '',
        this.tipoCliente
      );

      await this.db.subirDoc('clientes', cliente, true);
      console.log('Cliente subido con éxito');
    }
  }


  async scan() {
    this.pressedButton = true; // Indica que el botón de escaneo fue presionado
    setTimeout(async () => {
      this.pressedButton = false; // Reinicia el estado del botón después del retraso
      this.scanActive = true; // Activa el estado de escaneo

      const barcodes = await this.scanService.scanBarcodes(); // Usa ScanService para escanear códigos de barras
      this.processBarcodes(barcodes); // Procesa los códigos de barras escaneados

      this.scanActive = false; // Desactiva el estado de escaneo
    }, 2000); // Retraso de 2 segundos antes de iniciar el escaneo
  }

  processBarcodes(barcodes: Barcode[]) {
    barcodes.forEach(barcode => {
      const dniData = this.scanService.extractDniData(barcode.rawValue); // Usa ScanService para extraer datos del DNI
      if (dniData) {
        this.DNI.setValue(dniData.dni);
        this.nombre.setValue(dniData.nombre);
        this.apellido.setValue(dniData.apellido);
      }
    });
  }
}
