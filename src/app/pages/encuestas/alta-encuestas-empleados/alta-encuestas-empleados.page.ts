import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonCheckbox, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonButton, IonRadioGroup, IonRadio, IonItem, IonList } from '@ionic/angular/standalone';
import { RangeEstrellasComponent } from 'src/app/components/range-estrellas/range-estrellas.component';
import { FotosService } from 'src/app/services/fotos.service';
import { AuthService } from 'src/app/services/auth.service';
import { AspectosRest, EncuestaEmpleado } from 'src/app/utils/classes/encuestas/encuesta-empleado';
import { Empleado, TurnoEmpleado } from 'src/app/utils/classes/usuarios/empleado';
import { StorageService } from 'src/app/services/storage.service';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { ErrorCodes, Exception } from 'src/app/utils/classes/exception';
import { ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavController } from '@ionic/angular/standalone'

@Component({
  selector: 'app-alta-encuestas-empleados',
  templateUrl: './alta-encuestas-empleados.page.html',
  styleUrls: ['./alta-encuestas-empleados.page.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonRadio, IonRadioGroup, IonButton, IonCardHeader, IonCardContent, IonCardTitle, IonCard, IonCheckbox, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, RangeEstrellasComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AltaEncuestasEmpleadosPage {
  encuestaFrm: FormGroup;
  foto?: File;

  constructor(protected fotosServ: FotosService, private auth: AuthService, private db: DatabaseService, private storage: StorageService, private spinner: NgxSpinnerService, private navCtrl: NavController) {
    this.encuestaFrm = inject(FormBuilder).group({
      turno: ['', [Validators.required]],
      accion: ['', [Validators.required]],
      condEspacio: [
        5, [
          Validators.required,
          Validators.min(0),
          Validators.max(5),
        ]
      ],
      fotoSubida: [false, [Validators.requiredTrue]],
      comentarios: ['', [Validators.required]],
      aspectosBuenasCond: [[]],
    });
  }

  valorSelect($ev: CustomEvent) {
    this.encuestaFrm.controls['turno'].setValue($ev.detail.value);
  }

  valorRadio($ev: CustomEvent) {
    this.encuestaFrm.controls['accion'].setValue($ev.detail.value);
  }

  tomarFoto() {
    this.fotosServ.tomarFoto().then((foto) => {
      if (foto) {
        this.foto = foto;
        this.encuestaFrm.controls['fotoSubida'].setValue(true);
      }
    });
  }

  omitirFoto: boolean = false;
  toggleOmitirFotos() {
    const fotosCtrl = this.encuestaFrm.controls['fotoSubida'];
    this.omitirFoto = !this.omitirFoto;
    if (this.omitirFoto)
      fotosCtrl.disable();
    else
      fotosCtrl.enable();
  }

  readonly AspectosCheck: { valor: AspectosRest, label: string }[] = [
    { valor: 'iluminación', label: 'Iluminación' },
    { valor: 'ventilación', label: 'Ventilación' },
    { valor: 'temperatura', label: 'Temperatura' },
    { valor: 'ruido', label: 'Ruido' },
    { valor: 'seguridad', label: 'Seguridad' }
  ];

  valorCheck(check: string) {
    const checkCtrl = this.encuestaFrm.controls['aspectosBuenasCond'];
    let checkAux: string[] = [...checkCtrl.value];

    const index = checkAux.indexOf(check);
    if (index === -1)
      checkAux.push(check);
    else
      checkAux.splice(index, 1);

    checkCtrl.setValue(checkAux);
  }

  isChecked = (check: string) => {
    const checkCtrl = <string[]>this.encuestaFrm.controls['aspectosBuenasCond'].value;
    return checkCtrl.includes(check);
  };

  async subirEncuesta() {
    try {
      const empleado = this.auth.UsuarioEnSesion! as Empleado;
      let fotoUrl = '';
      if (!this.foto) {
        if (!this.omitirFoto) throw new Exception(ErrorCodes.FotoFaltante, 'Debe subir una foto.');
      } else {
        const nombreFoto = `${empleado.id}-${new Date().getTime()}`;
        this.spinner.show();
        fotoUrl = await this.storage.subirArchivo(this.foto, `${Colecciones.EncuestasEmpleado}/${nombreFoto}`);
        this.spinner.hide();
      }
      this.spinner.show();

      const turno = <TurnoEmpleado>this.encuestaFrm.controls['turno'].value;
      const accion = <'entrada' | 'salida'>this.encuestaFrm.controls['accion'].value;
      const condEspacio = <number>this.encuestaFrm.controls['condEspacio'].value;
      const comentarios = <string>this.encuestaFrm.controls['comentarios'].value;
      const aspectosBuenasCond = <AspectosRest[]>this.encuestaFrm.controls['aspectosBuenasCond'].value;

      const encuesta = new EncuestaEmpleado(empleado, turno, accion, condEspacio, fotoUrl, comentarios, aspectosBuenasCond);
      await this.db.subirDoc(Colecciones.EncuestasEmpleado, encuesta);

      this.spinner.hide();
      ToastSuccess.fire('Encuesta subida!');
      this.navCtrl.navigateRoot('home');
    } catch (error: any) {
      ToastError.fire('Ups...', error.message);
    }
  }
}
