import { TipoCliente } from './../../utils/classes/usuarios/cliente';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonFab, IonIcon, IonFabButton, IonFabList, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonButton, IonImg, IonRadioGroup, IonRadio } from '@ionic/angular/standalone';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { Colecciones } from 'src/app/services/database.service';
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
  frmCliente: FormGroup;
  tipoCliente: TipoCliente = 'registrado';
  picture!: File;
  isSupported = false;
  scanActive = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private scanService: ScannerService
  ) {
    this.frmCliente = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      DNI: [0, [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.scanService.isScannerSupported().then((supported) => {
      this.isSupported = supported;
    });
  }
  readonly supportedImageFormats = ['jpg', 'jpeg', 'png'];

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
        //  ToastInfo.fire('Operación cancelada.');
      } else {
         await MySwal.fire('Algo salió mal.', er.message, 'error');
        throw er;
      }
    }
  }
  async subirCliente() {
    try {
      const fotoUrl = await this.uploadPicture(this.picture);
      if (fotoUrl) {
        const cliente = new Cliente(
          '',
          this.frmCliente.value.nombre,
          this.frmCliente.value.apellido,
          this.frmCliente.value.DNI,
          fotoUrl,
          this.frmCliente.value.email,
          this.tipoCliente
        );

        await this.authService.registrarFireAuth(cliente, this.frmCliente.value.password);
        MySwal.fire('Cliente registrado con éxito');
      }
    } catch (error) {

      console.log("error",error)

    }
  }

  async scan() {
    this.scanActive = true;
    const barcodes = await this.scanService.scanBarcodes();
    this.processBarcodes(barcodes);
    this.scanActive = false;
  }

  processBarcodes(barcodes: Barcode[]) {
    barcodes.forEach(barcode => {
      const dniData = this.scanService.extractDniData(barcode.rawValue);
      if (dniData) {
        this.frmCliente.patchValue({
          DNI: dniData.dni,
          nombre: dniData.nombre,
          apellido: dniData.apellido
        });
      }
    });
  }

  private async getFileFromUri(fileUri: string, fileFormat: string): Promise<File> {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    return new File([blob], `photo.${fileFormat}`, { type: `image/${fileFormat}` });
  }

  private async uploadPicture(image: File): Promise<string> {
    const nombreFoto = `${this.frmCliente.value.DNI}`;
    return this.storageService.subirArchivo(image, `${Colecciones.Usuarios}/${nombreFoto}`);
  }
}
