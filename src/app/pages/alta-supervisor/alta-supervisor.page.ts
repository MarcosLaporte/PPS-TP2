import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonRadioGroup, IonRadio, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonIcon, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MySwal, ToastError, ToastSuccess, ToastInfo } from 'src/app/utils/alerts';
import { AuthService } from 'src/app/services/auth.service';
import { Colecciones, Prefijos, DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { Jefe, TipoJefe } from 'src/app/utils/classes/usuarios/jefe';
import { Foto } from 'src/app/utils/interfaces/foto';
import { NgxSpinnerService } from 'ngx-spinner';
import { Exception, ErrorCodes } from 'src/app/utils/classes/exception';
import { addIcons } from 'ionicons';
import { search, scanOutline, scanCircleOutline} from 'ionicons/icons';
import { Barcode } from '@capacitor-mlkit/barcode-scanning';
import { ScannerService } from 'src/app/services/scanner.service';

const datePipe = new DatePipe('en-US', '-0300');

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
  standalone: true,
  imports: [ IonIcon, IonCardContent, IonCardTitle, IonCard, IonCardHeader, IonRadio, IonRadioGroup, IonItem, IonButton, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInputPasswordToggle],
})
export class AltaSupervisorPage implements OnInit {

  picture!: File;
  tempImg: string = "";

  isSupported = false;
  scanActive = false;

  frmSupervisor: FormGroup;
  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private scanService: ScannerService
  ) {
    this.frmSupervisor = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      DNI: new FormControl('', [ Validators.required,Validators.pattern(/^\b[\d]{1,3}(\.|\-|\/| )?[\d]{3}(\.|\-|\/| )?[\d]{3}$/),]),
      CUIL: new FormControl('', [Validators.required, this.verificarCuil]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      foto: new FormControl('', [Validators.required]),
      contra: new FormControl('', [Validators.required]),
      supervisorDueno: [null, [Validators.required]],
    });

    addIcons({ search, scanOutline, scanCircleOutline});
  }

  readonly supportedImageFormats = ['jpg', 'jpeg', 'png'];

  ngOnInit() {}

  fillFields(){
     this.frmSupervisor.controls['nombre'].setValue("Jaco");
     this.frmSupervisor.controls['apellido'].setValue("Luna");
     this.frmSupervisor.controls['DNI'].setValue("43628819");
     this.frmSupervisor.controls['CUIL'].setValue("20436288191");
     this.frmSupervisor.controls['correo'].setValue("jacoluna01@gmail.com");
     this.frmSupervisor.controls['contra'].setValue("123456");
  }

  async takePic() {
    let picTaken = false;
    let picCancel = false;
    try {
      do{
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      if (!this.supportedImageFormats.includes(image.format))
        throw new Error('El archivo debe ser de formato .JPG, .JPEG ó .PNG');

      this.spinner.show();
        await MySwal.fire({
          text: 'esta foto desea subir?',
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
          if(res.isConfirmed){
            const imgFile = await this.getFileFromUri(image.webPath!, image.format);
            this.picture = imgFile;
            this.tempImg = image.webPath!;
            this.frmSupervisor.controls['foto'].setErrors(null)
            console.log(this.frmSupervisor.controls);
            picTaken = true;
          }else if(res.isDenied){
            picCancel = true;
          }
          this.spinner.hide();
        });
      }while(!picTaken && !picCancel)
    } catch (er: any) {
      if (er.message === 'User cancelled photos app')
        ToastInfo.fire('Operación cancelada.');
        else await MySwal.fire('Algo salió mal.', er.message, 'error');
        throw er;
    }
  }

  private async getFileFromUri( fileUri: string, fileFormat: string): Promise<File> {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const file = new File([blob], 'photo.jpg', {
      type: 'image/' + fileFormat,
    });
    return file;
  }

  async uploadPicture(image: File) {
    this.spinner.show();

    const datetime: Date = new Date();

    const nombreFoto: string = 
    `${Prefijos.Supervisor}-
    ${this.frmSupervisor.controls['nombre'].value}-
    ${this.frmSupervisor.controls['apellido'].value}-
    ${this.frmSupervisor.controls['DNI'].value}`;

    try {
      const url = await this.storage.subirArchivo(image,`${Colecciones.Usuarios}/${nombreFoto}`);
      const fotoDePerfil: Foto = {
        id: '',
        name: nombreFoto,
        date: datetime,
        url: url,
      };
      console.log(fotoDePerfil);
      await this.db.subirDoc(Colecciones.Usuarios, fotoDePerfil, true);
      this.spinner.hide();
      ToastSuccess.fire('Imagen subida con éxito!');
      return url;
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Hubo un problema al subir la imagen.');
      return null;
    }
  }

  subirSupervisor() {
    let foto;
    this.uploadPicture(this.picture).then((url) => {
      foto = url;
    });
    if (foto) {
      
      const nombre = this.frmSupervisor.controls['nombre'].value;
      const apellido = this.frmSupervisor.controls['apellido'].value;
      const DNI = Number((this.frmSupervisor.controls['dni'].value).replace(/[-. ]/g, ''));
      const CUIL = Number((this.frmSupervisor.controls['cuil'].value).replace(/[-. ]/g, ''));
      const correo = this.frmSupervisor.controls['correo'].value;
      const contra = this.frmSupervisor.controls['contra'].value;
      const supervisorDueno = this.frmSupervisor.controls['tipoEmpleado'].value as TipoJefe;

      let jefe = new Jefe(
        '',
        nombre,
        apellido,
        DNI,
        CUIL,
        correo,
        foto,
        supervisorDueno
      );

      this.db
        .subirDoc(Colecciones.Usuarios, jefe, true)
        .then((r) => {
          console.log('id' + r);
        });
    }
  }

  async manejarCorreo() {
    this.spinner.show();

    await this.db
      .buscarUsuarioPorCorreo(this.frmSupervisor.controls['correo'].value)
      .then((pers) =>
        ToastError.fire('Este correo ya se encuentra registrado.')
      )
      .catch((error: any) => {
        if (
          error instanceof Exception && error.code === ErrorCodes.CorreoNoRegistrado
        ) {
          document.getElementById('correo')!.classList.add('deshabilitado');
          (document.getElementById('input-correo')! as HTMLIonInputElement).disabled = true;
          (document.getElementById('btn-correo')! as HTMLIonButtonElement).style.display = 'none';
          
          document.getElementById('DNI')!.classList.remove('deshabilitado');
          (document.getElementById('btn-DNI')! as HTMLIonButtonElement).style.display = 'block';
          (document.getElementById('btn-scan-DNI')! as HTMLIonButtonElement).style.display = 'block';

          // (document.getElementById('btn-scan-DNI')! as HTMLIonButtonElement).classList.remove('deshabilitado');

          ToastSuccess.fire('El correo no está en uso.');

        } else ToastError.fire('Ocurrió un erorr.', error.message);
      });

    this.spinner.hide();
  }

  private verificarCuil(control: AbstractControl): null | object {
    if (!control.value) return null;

    const DNI = (<string>control.parent?.value.DNI).replace(/[-. ]/g, '');
    const cuil = (<string>control.value).replace(/[-. ]/g, '');
    const dniEnCuil = cuil.slice(2, cuil.length - 1);

    if (!cuil.match(/^(20|23|24|27|30|33|34)(\D)?[0-9]{7,9}(\D)?[0-9]$/g))
      return { patron: true };
    else if (dniEnCuil !== DNI) return { dniNoEncontrado: true };

    return null;
  }

  async buscarDni() {
    this.spinner.show();
    const dniCtrl = this.frmSupervisor.controls['DNI'];

    await this.db
      .buscarUsuarioPorDni(dniCtrl.value.replace(/[-. ]/g, ''))
      .then((pers) => ToastError.fire('Este DNI ya se encuentra registrado.'))
      .catch((error: any) => {
        if (
          error instanceof Exception &&
          error.code === ErrorCodes.DniNoRegistrado
        ) {
          ToastSuccess.fire('El DNI no está registrado.');
          document
            .getElementById('datos-personales')!
            .classList.remove('deshabilitado');
          document.getElementById('DNI')!.classList.add('deshabilitado');
          (
            document.getElementById('input-DNI')! as HTMLIonInputElement
          ).disabled = true;
          (
            document.getElementById('btn-DNI')! as HTMLIonButtonElement
          ).style.display = 'none';
        } else ToastError.fire('Ocurrió un erorr.', error.message);
      });

    this.spinner.hide();
  }

  selecTipo($ev: CustomEvent) {
    this.frmSupervisor.controls['supervisorDueno'].setValue($ev.detail.value);
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
        this.frmSupervisor.patchValue({
          DNI: dniData.dni,
          nombre: dniData.nombre,
          apellido: dniData.apellido
        });
      }
    });
  }
}
