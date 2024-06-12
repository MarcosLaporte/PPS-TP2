import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonFabList, IonIcon, IonCard, IonCardContent, IonButton, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { DatabaseService } from 'src/app/services/database.service';
import { ErrorCodes, Exception } from 'src/app/utils/clases/exception';
import { ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { Empleado, TipoEmpleado } from 'src/app/utils/clases/usuarios/empleado';

@Component({
  selector: 'app-alta-empleado',
  templateUrl: './alta-empleado.component.html',
  styleUrls: ['./alta-empleado.component.scss'],
  standalone: true,
  imports: [IonCard, IonItem, IonButton, IonCardContent, IonCard, IonIcon, IonFabList, IonFabButton, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, FormsModule, ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AltaEmpleadoComponent {
  empleadoFrm: FormGroup;

  constructor(protected navCtrl: NavController, private auth: AuthService, private spinner: NgxSpinnerService, private db: DatabaseService) {
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
      // fotoUrl: [
      //   '', [
      //     Validators.required,
      //   ]
      // ],
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

  async manejarCorreo() {
    this.spinner.show();

    await this.db.buscarUsuarioPorCorreo(this.empleadoFrm.controls['correo'].value)
      .then((pers) => ToastError.fire('Este correo ya se encuentra registrado.'))
      .catch((error: any) => {
        if (error instanceof Exception && error.code === ErrorCodes.CorreoNoRegistrado) {
          ToastSuccess.fire('El correo no está en uso.');
          document.getElementById('dni')!.classList.remove('deshabilitado');
          document.getElementById('correo')!.classList.add('deshabilitado');
          (document.getElementById('input-correo')! as HTMLIonInputElement).disabled = true;
          (document.getElementById('btn-correo')! as HTMLIonButtonElement).style.display = 'none';
          (document.getElementById('btn-dni')! as HTMLIonButtonElement).style.display = 'block';
        } else ToastError.fire('Ocurrió un erorr.', error.message);
      });

    this.spinner.hide();
  }

  async buscarDni() {
    this.spinner.show();
    const dniCtrl = this.empleadoFrm.controls['dni'];

    await this.db.buscarUsuarioPorDni(dniCtrl.value.replace(/[-. ]/g, ''))
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

  async subirEmpleado() {
    try {
      this.spinner.show();

      const nombre = this.empleadoFrm.controls['nombre'].value;
      const apellido = this.empleadoFrm.controls['apellido'].value;
      const dni = Number((this.empleadoFrm.controls['dni'].value).replace(/[-. ]/g, ''));
      const cuil = Number((this.empleadoFrm.controls['cuil'].value).replace(/[-. ]/g, ''));
      const correo = this.empleadoFrm.controls['correo'].value;
      const contra = this.empleadoFrm.controls['contra'].value;
      // const fotoUrl = this.empleadoFrm.controls['fotoUrl'].value;
      const tipoEmpleado = this.empleadoFrm.controls['tipoEmpleado'].value as TipoEmpleado;

      const empleado = new Empleado('', nombre, apellido, dni, cuil, correo, '', tipoEmpleado);
      await this.auth.registrarFireAuth(empleado, contra);
      ToastSuccess.fire('Empleado creado!');
      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ocurrió un error.', error.message);
    }
  }
}
