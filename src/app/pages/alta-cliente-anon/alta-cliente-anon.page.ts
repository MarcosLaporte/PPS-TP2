import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonFab, IonIcon, IonFabButton, IonFabList, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonButton, IonImg, IonRadioGroup, IonRadio, IonCard, IonCardHeader, IonCardTitle, IonCardContent,IonInputPasswordToggle, IonToggle, IonText } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { FotosService } from 'src/app/services/fotos.service';
import { StorageService } from 'src/app/services/storage.service';
import { ErrorCodes, Exception } from 'src/app/utils/classes/exception';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { ToastError, ToastSuccess } from 'src/app/utils/alerts';

@Component({
  selector: 'app-alta-cliente-anon',
  templateUrl: './alta-cliente-anon.page.html',
  styleUrls: ['./alta-cliente-anon.page.scss'],
  standalone: true,
  imports: [IonText, IonToggle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonRadio, IonRadioGroup, IonImg, IonButton, IonItem, IonLabel, IonCol, IonRow, IonGrid, IonFabList, IonFabButton, IonIcon, IonFab, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule,IonInputPasswordToggle]
})
export class AltaClienteAnonPage {
  frmCliente: FormGroup;
  picture!: File;

  constructor(
    protected navCtrl: NavController, private auth: AuthService, private spinner: NgxSpinnerService,
    private storage: StorageService, private fotosServ: FotosService
  ) {
    this.frmCliente = inject(FormBuilder).group({
      nombre: ['', [
        Validators.required,
        Validators.pattern(/[\p{L}\p{M}]+/u),
      ]],
    });
  }

  async tomarFotoCliente() {
    const foto = await this.fotosServ.tomarFoto();
    let fotoUrl = '';

    if (!foto) throw new Exception(ErrorCodes.FotoCancelada, 'Debe tomar una foto del cliente.');

    this.spinner.show();
    const nombre = this.frmCliente.controls['nombre'].value;
    fotoUrl = await this.storage.subirArchivo(foto, `${Colecciones.Usuarios}/cliente-anon-${nombre}`);
    this.spinner.hide();

    return fotoUrl;
  }

  async subirCliente() {
    try {
      let fotoUrl = await this.tomarFotoCliente();

      this.spinner.show();
      const nombre = this.frmCliente.controls['nombre'].value;

      const cliente = Cliente.crearClienteAnon(nombre, fotoUrl);
      await this.auth.registrarUsuarioAnonimo(cliente);
      ToastSuccess.fire('Registrado de forma anónima!');
        this.navCtrl.navigateRoot('home');

      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ocurrió un error', error.message);
    }
  }

}
