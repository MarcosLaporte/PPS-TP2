import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonFab, IonIcon, IonFabButton, IonFabList, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonButton, IonImg, IonRadioGroup, IonRadio, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInputPasswordToggle, IonToggle, IonText } from '@ionic/angular/standalone';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { NavController } from '@ionic/angular/standalone';
import { MySwal, ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorCodes, Exception } from 'src/app/utils/classes/exception';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { FotosService } from 'src/app/services/fotos.service';
import { PushService } from 'src/app/services/push.service';

const datePipe = new DatePipe('en-US', '-0300');

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonText, IonToggle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonRadio, IonRadioGroup, IonImg, IonButton, IonItem, IonLabel, IonCol, IonRow, IonGrid, IonFabList, IonFabButton, IonIcon, IonFab, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule, IonInputPasswordToggle]
})
export class AltaClientePage {
  frmCliente: FormGroup;

  constructor(
    protected navCtrl: NavController, protected auth: AuthService, private spinner: NgxSpinnerService,
    private db: DatabaseService, private scanner: ScannerService, private storage: StorageService, private fotosServ: FotosService,
    private notification:PushService
  ) {
    this.frmCliente = inject(FormBuilder).group({
      nombre: ['', [
        Validators.required,
        Validators.pattern(/[\p{L}\p{M}]+/u),
      ]],
      apellido: ['', [
        Validators.required,
        Validators.pattern(/[\p{L}\p{M}]+/u),
      ]],
      dni: ['', [
        Validators.required,
        Validators.pattern(/^\b[\d]{1,3}(\.|\-|\/| )?[\d]{3}(\.|\-|\/| )?[\d]{3}$/),
      ]],
      correo: ['', [
        Validators.required,
        Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
      ]],
      contra: ['', [Validators.required]],
      reContra: ['', [
        Validators.required,
        this.contraseñasCoinciden,
      ]],
    });

    addIcons({ search });
  }

  private contraseñasCoinciden = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const contra = control.parent?.value.contra;
    const reContra = <string>control.value;

    if (contra !== reContra) {
      return { noCoinciden: true };
    }

    return null;
  }

  verificarCoincid() {
    const contraCtrl = this.frmCliente.controls['contra'];
    const reContraCtrl = this.frmCliente.controls['reContra'];

    if (reContraCtrl.dirty) {
      if (contraCtrl.value !== reContraCtrl.value)
        reContraCtrl.setErrors({ noCoinciden: true });
      else
        reContraCtrl.setErrors(null);
    }
  }

  filtrarInputDoc($ev: any) {
    console.log($ev);

    const patron = /^[0-9 .\-\ ]*$/gm;
    const inputChar = String.fromCharCode($ev.charCode);
    if (!patron.test(inputChar)) {
      $ev.preventDefault();
    }
    return true;
  }

  async subirCliente() {
    try {
      let fotoUrl = await this.tomarFotoCliente();

      this.spinner.show();
      const nombre = this.frmCliente.controls['nombre'].value;
      const apellido = this.frmCliente.controls['apellido'].value;
      const dni = Number((this.frmCliente.controls['dni'].value).replace(/[-. ]/g, ''));
      const correo = this.frmCliente.controls['correo'].value;
      const contra = this.frmCliente.controls['contra'].value;

      const cliente = new Cliente(nombre, apellido, dni, correo, fotoUrl, 'registrado');
      await this.auth.registrarUsuario(cliente, contra);
      ToastSuccess.fire('Cliente creado!');

       // Enviar notificación a los usuarios con rol "jefe"
       const title = "Nuevo Cliente Registrado";
       const body = `El cliente ${nombre} ${apellido} se ha registrado.`;
       this.notification.sendNotificationToRole(title, body, 'jefe').subscribe(
           response => console.log('Notificación enviada', response),
           error => console.error('Error al enviar la notificación', error)
       );


      this.resetForm();
      if (this.auth.UsuarioEnSesion!.rol === 'cliente')
        this.navCtrl.navigateRoot('home');

      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      console.error(error);
      ToastError.fire('Ocurrió un error', error.message);
    }
  }

  async escanearDni() {
    try {
      this.spinner.show();

      const valorCrudo = await this.scanner.escanear([BarcodeFormat.Pdf417]);
      const datosDni = this.scanner.extraerDatosDni(valorCrudo);
      this.frmCliente.patchValue({
        dni: (datosDni.dni).toString(),
        cuil: (datosDni.cuil).toString(),
        nombre: datosDni.nombre,
        apellido: datosDni.apellido
      });

      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ups...', error.message);
    }
  }

  async tomarFotoCliente() {
    const foto = await this.fotosServ.tomarFoto();
    let fotoUrl = '';

    if (!foto) throw new Exception(ErrorCodes.FotoCancelada, 'Debe tomar una foto del cliente.');

    this.spinner.show();
    const dni = <string>this.frmCliente.controls['dni'].value;
    fotoUrl = await this.storage.subirArchivo(foto, `${Colecciones.Usuarios}/cliente-${dni}`);
    this.spinner.hide();

    return fotoUrl;
  }

  async buscarCorreo() {
    this.spinner.show();

    await this.db.buscarUsuarioPorCorreo(this.frmCliente.controls['correo'].value)
      .then((pers) => ToastError.fire('Este correo ya se encuentra registrado.'))
      .catch((error: any) => {
        if (error instanceof Exception && error.code === ErrorCodes.CorreoNoRegistrado) {
          document.getElementById('dni')!.classList.remove('deshabilitado');
          document.getElementById('datos-personales')!.classList.remove('deshabilitado');
          document.getElementById('correo')!.classList.add('deshabilitado');
          (document.getElementById('input-correo')! as HTMLIonInputElement).disabled = true;
          (document.getElementById('input-dni')! as HTMLIonInputElement).disabled = false;
          (document.getElementById('btn-correo')! as HTMLIonButtonElement).style.display = 'none';
          (document.getElementById('btn-dni')! as HTMLIonButtonElement).style.display = 'block';
          ToastSuccess.fire('El correo no está en uso.');
        } else ToastError.fire('Ocurrió un erorr.', error.message);
      });

    this.spinner.hide();
  }

  async buscarDni() {
    this.spinner.show();
    const dniValue = <string>this.frmCliente.controls['dni'].value;
    const dni = dniValue.replace(/[-. ]/g, '');

    await this.db.buscarUsuarioPorDni(Number(dni))
      .then((pers) => ToastError.fire('Este DNI ya se encuentra registrado.'))
      .catch((error: any) => {
        if (error instanceof Exception && error.code === ErrorCodes.DniNoRegistrado) {
          ToastSuccess.fire('El DNI no está registrado.');
          document.getElementById('datos-personales')!.classList.remove('deshabilitado');
          document.getElementById('dni')!.classList.add('deshabilitado');
          (document.getElementById('input-dni')! as HTMLIonInputElement).disabled = true;
          (document.getElementById('btn-dni')! as HTMLIonButtonElement).style.display = 'none';
        } else ToastError.fire('Ocurrió un erorr.', error.message);
      });

    this.spinner.hide();
  }

  private resetForm() {
    this.frmCliente.reset();
    document.getElementById('correo')!.classList.remove('deshabilitado');
    document.getElementById('dni')!.classList.add('deshabilitado');
    (document.getElementById('input-correo')! as HTMLIonInputElement).disabled = false;
    (document.getElementById('btn-correo')! as HTMLIonButtonElement).style.display = 'block';
    (document.getElementById('btn-dni')! as HTMLIonButtonElement).style.display = 'none';
    document.getElementById('datos-personales')!.classList.add('deshabilitado');
  }

}
