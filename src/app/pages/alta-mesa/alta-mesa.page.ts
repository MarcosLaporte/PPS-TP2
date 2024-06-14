import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonRadioGroup, IonButton, IonSelectOption, IonInput } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Colecciones, Prefijos, DatabaseService, } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MySwal, ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { Foto } from 'src/app/utils/interfaces/foto';
import { Mesa, TipoMesa } from 'src/app/utils/classes/mesa';
import { NgxSpinnerService } from 'ngx-spinner';

const datePipe = new DatePipe('en-US', '-0300');

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.page.html',
  styleUrls: ['./alta-mesa.page.scss'],
  standalone: true,
  imports: [ IonButton, IonRadioGroup, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonInput, CommonModule, FormsModule, ReactiveFormsModule, ],
})
export class AltaMesaPage {

  frmMesa: FormGroup;
  numero = new FormControl('', [Validators.required]);
  cantComensales = new FormControl('', [Validators.required]);
  tipoMesaControl = new FormControl('', [Validators.required]);
  fotoUrl = new FormControl('', [Validators.required]);

  picture!: File;
  QRs: string[] = [];

  tipoMesa: TipoMesa[] = ['VIP', 'discapacitados', 'estandar'];
  
  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.frmMesa = this.formBuilder.group({
      numero: this.numero,
      cantComensales: this.cantComensales,
      tipoMesaControl: this.tipoMesaControl,
      fotoUrl: this.fotoUrl,
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
      if (!this.supportedImageFormats.includes(image.format))
        throw new Error('El archivo debe ser de formato .JPG, .JPEG ó .PNG');

      // this.spinner.show();
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
        proceed = !res.isDenied;
        const imgFile = await this.getFileFromUri(image.webPath!, image.format);
        this.picture = imgFile;
      });
    } catch (er: any) {
      if (er.message === 'User cancelled photos app')
        // ToastInfo.fire('Operación cancelada.');
        // else await MySwal.fire('Algo salió mal.', er.message, 'error');
        throw er;
    }
  }

  private async getFileFromUri(
    fileUri: string,
    fileFormat: string
  ): Promise<File> {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const file = new File([blob], 'photo.jpg', {
      type: 'image/' + fileFormat,
    });
    return file;
  }

  async uploadPicture(image: File) {
    // this.spinner.show();

    const datetime: Date = new Date();
    const dateStr: string = datePipe.transform(datetime, 'yyyyMMdd-HHmmss')!;
    // const picName: string = `${this.auth.UserInSession!.name}-${this.auth.UserInSession!.lastname}-${dateStr}`;
    // const nombreFoto: string = `${this.auth.UsuarioEnSesion!.nombre}-${
    //   this.auth.UsuarioEnSesion!.apellido
    // }-${dateStr}`;

    const nombreFoto: string = `Mesa-${this.numero.value}-${dateStr}`;

    try {
      const url = await this.storage.subirArchivo(
        image,
        `${Colecciones.Mesas}/${Prefijos.Mesa}-${nombreFoto}`
      );
      const fotoDeMesa: Foto = {
        id: '',
        name: nombreFoto,
        date: datetime,
        url: url,
      };
      console.log(fotoDeMesa);
      await this.db.subirDoc(Colecciones.Mesas, fotoDeMesa, true);
      return url;
      this.spinner.hide();
      ToastSuccess.fire('Imagen subida con éxito!');
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Hubo un problema al subir la imagen.');
      return null;
    }
  }

  subirMesa() {
    let foto;
    this.uploadPicture(this.picture).then((url) => {
      foto = url;
    });
    if (foto) {
      let supervisorDueno = new Mesa(
        Number(this.numero.value),
        Number(this.cantComensales.value),
        <TipoMesa>this.tipoMesaControl.value!,
        foto,
        this.QRs
      );

      this.db.subirDoc(Colecciones.Mesas, supervisorDueno, true).then((r) => {
        console.log('id' + r);
      });
    }
  }

  fillFields() {
    this.numero.setValue('1');
    this.cantComensales.setValue('1');
    this.tipoMesaControl.setValue('VIP');
  }
}
