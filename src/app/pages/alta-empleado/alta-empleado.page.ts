import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonFab, IonFabButton, IonFabList, IonIcon, IonCard, IonCardContent, IonButton, IonItem, IonInputPasswordToggle, IonCardHeader, IonCardTitle, IonRadioGroup, IonRadio, IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { ErrorCodes, Exception } from 'src/app/utils/classes/exception';
import { MySwal, ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { Empleado, TipoEmpleado } from 'src/app/utils/classes/usuarios/empleado';
import { ScannerService } from 'src/app/services/scanner.service';
import { tomarFoto } from 'src/main';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.page.html',
  styleUrls: ['./alta-empleado.page.scss'],
  standalone: true,
  imports: [IonText, IonRadio, IonRadioGroup, IonCardTitle, IonCardHeader, IonCard, IonItem, IonButton, IonCardContent, IonCard, IonIcon, IonFabList, IonFabButton, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonInputPasswordToggle, FormsModule, ReactiveFormsModule, CommonModule],
})
export class AltaEmpleadoPage {
  empleadoFrm: FormGroup;

  constructor(protected navCtrl: NavController, private auth: AuthService, private spinner: NgxSpinnerService, private db: DatabaseService, private scannerServ: ScannerService, private storage: StorageService) {
    this.empleadoFrm = inject(FormBuilder).group({
      tipoEmpleado: [
        null, [
          Validators.required,
        ]
      ],
      correo: [
        '', [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]
      ],
      dni: [
        '', [
          Validators.required,
          Validators.pattern(/^\b[\d]{1,3}(\.|\-|\/| )?[\d]{3}(\.|\-|\/| )?[\d]{3}$/),
        ]
      ],
      cuil: [
        '', [
          Validators.required,
          this.verificarCuil,
        ]
      ],
      nombre: [
        '', [
          Validators.required,
          Validators.pattern(/[\p{L}\p{M}]+/u),
        ]
      ],
      apellido: [
        '', [
          Validators.required,
          Validators.pattern(/[\p{L}\p{M}]+/u),
        ]
      ],
      contra: [
        '', [
          Validators.required,
        ]
      ]
    });

    addIcons({ search });
  }

  private verificarCuil(control: AbstractControl): null | object {
    if (!control.value) return null;

    const dni = (<string>control.parent?.value.dni).replace(/[-. ]/g, '');
    const cuil = (<string>control.value).replace(/[-. ]/g, '');
    const dniEnCuil = cuil.slice(2, cuil.length - 1);

    if (!cuil.match(/^(20|23|24|27|30|33|34)(\D)?[0-9]{7,9}(\D)?[0-9]$/g))
      return { patron: true };
    else if (dniEnCuil !== dni)
      return { dniNoEncontrado: true };

    return null;
  }

  selecTipo($ev: CustomEvent) {
    this.empleadoFrm.controls['tipoEmpleado'].setValue($ev.detail.value);
  }

  async buscarCorreo() {
    this.spinner.show();

    await this.db.buscarUsuarioPorCorreo(this.empleadoFrm.controls['correo'].value)
      .then((pers) => ToastError.fire('Este correo ya se encuentra registrado.'))
      .catch((error: any) => {
        if (error instanceof Exception && error.code === ErrorCodes.CorreoNoRegistrado) {
          document.getElementById('dni')!.classList.remove('deshabilitado');
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
    const dniCtrl = this.empleadoFrm.controls['dni'];

    await this.db.buscarUsuarioPorDni(Number(dniCtrl.value.replace(/[-. ]/g, '')))
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

  async escanearDni() {
    this.spinner.show();
    const barcodes = await this.scannerServ.scanBarcodes();
    barcodes.forEach(barcode => {
      const dniData = this.scannerServ.extractDniData(barcode.rawValue);
      if (dniData) {
        this.empleadoFrm.patchValue({
          nombre: dniData.nombre,
          apellido: dniData.apellido,
          dni: dniData.dni,
        });
      }
    });
    this.spinner.hide();
  }

  async subirEmpleado() {
    try {
      let fotoUrl = '';
      await MySwal.fire({
        title: '¿Desea subir foto del empleado?',
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        confirmButtonColor: '#a5dc86',
        showDenyButton: true,
        denyButtonText: 'No',
        denyButtonColor: '#f0ec0d',
      }).then(async (res) => {
        if (res.isConfirmed)
          fotoUrl = await this.tomarFotoEmpleado();
      });

      this.spinner.show();
      const nombre = this.empleadoFrm.controls['nombre'].value;
      const apellido = this.empleadoFrm.controls['apellido'].value;
      const dni = Number((this.empleadoFrm.controls['dni'].value).replace(/[-. ]/g, ''));
      const cuil = Number((this.empleadoFrm.controls['cuil'].value).replace(/[-. ]/g, ''));
      const correo = this.empleadoFrm.controls['correo'].value;
      const contra = this.empleadoFrm.controls['contra'].value;
      const tipoEmpleado = this.empleadoFrm.controls['tipoEmpleado'].value as TipoEmpleado;

      const empleado = new Empleado('', nombre, apellido, dni, cuil, correo, fotoUrl, tipoEmpleado);
      await this.auth.registrarUsuario(empleado, contra);
      this.resetForm();

      this.spinner.hide();
      ToastSuccess.fire('Empleado creado!');
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ocurrió un error.', error.message);
    }
  }

  async tomarFotoEmpleado() {
    const foto = await tomarFoto();
    let fotoUrl = '';

    if (foto) {
      this.spinner.show();
      const tipo = <string>this.empleadoFrm.controls['tipoEmpleado'].value;
      const nombre = <string>this.empleadoFrm.controls['nombre'].value;
      const apellido = <string>this.empleadoFrm.controls['apellido'].value;

      fotoUrl = await this.storage.subirArchivo(foto, `${Colecciones.Usuarios}/empleado-${tipo}-${nombre}-${apellido}`);
      this.spinner.hide();
    }

    return fotoUrl;
  }

  private resetForm() {
    this.empleadoFrm.reset();
    document.getElementById('correo')!.classList.remove('deshabilitado');
    document.getElementById('dni')!.classList.add('deshabilitado');
    (document.getElementById('input-correo')! as HTMLIonInputElement).disabled = false;
    (document.getElementById('btn-correo')! as HTMLIonButtonElement).style.display = 'block';
    (document.getElementById('btn-dni')! as HTMLIonButtonElement).style.display = 'none';
    document.getElementById('datos-personales')!.classList.add('deshabilitado');
    (document.getElementById('tipo-radio')! as HTMLIonRadioGroupElement).value = null;
  }
}
