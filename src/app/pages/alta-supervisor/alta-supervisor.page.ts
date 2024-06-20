import { Component } from '@angular/core';
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
import { Foto } from 'src/app/utils/interfaces/interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import { Exception, ErrorCodes } from 'src/app/utils/classes/exception';
import { addIcons } from 'ionicons';
import { search, scanOutline, scanCircleOutline} from 'ionicons/icons';
import { Barcode, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { ScannerService } from 'src/app/services/scanner.service';
import { tomarFoto } from 'src/main';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
  standalone: true,
  imports: [ IonIcon, IonCardContent, IonCardTitle, IonCard, IonCardHeader, IonRadio, IonRadioGroup, IonItem, IonButton, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonInputPasswordToggle],
})
export class AltaSupervisorPage {

  picture!: File;
  tempImg: string = "";

  isSupported = false;

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

  fillFields(){
     this.frmSupervisor.controls['nombre'].setValue("Jaco");
     this.frmSupervisor.controls['apellido'].setValue("Luna");
     this.frmSupervisor.controls['DNI'].setValue("43628819");
     this.frmSupervisor.controls['CUIL'].setValue("20436288191");
     this.frmSupervisor.controls['correo'].setValue("jacoluna01@gmail.com");
     this.frmSupervisor.controls['contra'].setValue("123456");
  }

  async takePic() {
    const foto = await tomarFoto();
    if (foto)
      this.picture = foto;
  }

  async uploadPicture(image: File) {
    this.spinner.show();

    const datetime: Date = new Date();

    const nombreFoto: string = 
    `${Prefijos.Supervisor}-${this.frmSupervisor.controls['DNI'].value}`;

    try {
      const url = await this.storage.subirArchivo(image,`${Colecciones.Usuarios}/${nombreFoto}`);
      const fotoDePerfil: Foto = {
        id: '',
        name: nombreFoto,
        date: datetime,
        url: url,
      };

      // await this.db.subirDoc(Colecciones.Usuarios, fotoDePerfil, true);
      this.spinner.hide();
      ToastSuccess.fire('Imagen subida con éxito!');
      return url;
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Hubo un problema al subir la imagen.');
      return null;
    }
  }

  async subirSupervisor() {
    const fotoUrl = await this.uploadPicture(this.picture);

    if (fotoUrl) {
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
        fotoUrl,
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
    try {
      this.spinner.show();

      const valorCrudo = await this.scanService.escanear([BarcodeFormat.Pdf417]);
      const datosDni = this.scanService.extraerDatosDni(valorCrudo);
      this.frmSupervisor.patchValue({
        DNI: (datosDni.dni).toString(),
        CUIL: (datosDni.cuil).toString(),
        nombre: datosDni.nombre,
        apellido: datosDni.apellido
      });

      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ups...', error.message);
    }
  }
}
