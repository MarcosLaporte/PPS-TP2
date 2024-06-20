import { TipoCliente } from './../../utils/classes/usuarios/cliente';
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonFab, IonIcon, IonFabButton, IonFabList, IonGrid, IonRow, IonCol, IonLabel, IonItem, IonButton, IonImg, IonRadioGroup, IonRadio } from '@ionic/angular/standalone';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { Colecciones } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MySwal, ToastError } from 'src/app/utils/alerts';
import { BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { NgxSpinnerService } from 'ngx-spinner';
import { tomarFoto } from 'src/main';

const datePipe = new DatePipe('en-US', '-0300');

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonRadio, IonRadioGroup, IonImg, IonButton, IonItem, IonLabel, IonCol, IonRow, IonGrid, IonFabList, IonFabButton, IonIcon, IonFab, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule]
})
export class AltaClientePage {
  frmCliente: FormGroup;
  tipoCliente: TipoCliente = 'registrado';
  picture!: File;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private scanService: ScannerService,
    private spinner: NgxSpinnerService
  ) {
    this.frmCliente = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      DNI: [0, [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async takePic() {
    const foto = await tomarFoto();
    if (foto)
      this.picture = foto;
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

        await this.authService.registrarUsuario(cliente, this.frmCliente.value.password);
        MySwal.fire('Cliente registrado con éxito');
      }
    } catch (error) {

      console.log("error", error)

    }
  }

  async scan() {
    try {
      this.spinner.show();

      const valorCrudo = await this.scanService.escanear([BarcodeFormat.Pdf417]);
      const datosDni = this.scanService.extraerDatosDni(valorCrudo);
      this.frmCliente.patchValue({
        DNI: datosDni.dni,
        nombre: datosDni.nombre,
        apellido: datosDni.apellido
      });

      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ups...', error.message);
    }
  }

  private async uploadPicture(image: File): Promise<string> {
    const nombreFoto = `${this.frmCliente.value.DNI}`;
    return this.storageService.subirArchivo(image, `${Colecciones.Usuarios}/cliente-${nombreFoto}`);
  }
}
