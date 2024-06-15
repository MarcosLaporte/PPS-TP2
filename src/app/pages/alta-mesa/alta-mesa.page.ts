import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonRadioGroup, IonButton, IonSelectOption, IonInput, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonIcon, IonRadio } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Colecciones, Prefijos, DatabaseService, } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MySwal, ToastError, ToastSuccess, ToastInfo } from 'src/app/utils/alerts';
import { Foto } from 'src/app/utils/interfaces/foto';
import { Mesa, TipoMesa } from 'src/app/utils/classes/mesa';
import { NgxSpinnerService } from 'ngx-spinner';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { QrCodeModule } from 'ng-qrcode';

/*
QR de la mesa
● Para poder verificar la disponibilidad de una mesa.
● Para relacionar al cliente con una mesa.
● Para que el cliente pueda 'consultar' al mozo.
● Para que el cliente pueda acceder al menú.
● Para poder ver el estado del pedido.
● Para acceder a la encuesta de satisfacción.
● Para acceder a los juegos.
*/

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.page.html',
  styleUrls: ['./alta-mesa.page.scss'],
  standalone: true,
  imports: [IonRadio, IonIcon, IonCardContent, IonCardTitle, IonCard, IonCardHeader,  IonButton, IonRadioGroup, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonInput, CommonModule, FormsModule, ReactiveFormsModule, QrCodeModule],
})
export class AltaMesaPage {

  frmMesa: FormGroup;
  
  picture!: File;
  tempImg: string = "";
  QRs: string[] = [];
  
  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.frmMesa = this.formBuilder.group({
      nroMesa: new FormControl('', [Validators.required, Validators.min(1)]),
      cantComensales: new FormControl('', [Validators.required, Validators.min(1)]),
      tipoMesaControl: new FormControl('', [Validators.required]),
      foto: new FormControl('', [Validators.required]),
    });

    addIcons({ search });
  }

  readonly supportedImageFormats = ['jpg', 'jpeg', 'png'];


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
            this.frmMesa.controls['foto'].setErrors(null)
            picTaken = true;

            this.generateQRData();
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
    this.spinner.show();

    const datetime: Date = new Date();

    const nombreFoto: string = 
    `${Prefijos.Mesa}-
    ${this.frmMesa.controls['nroMesa'].value}-
    ${this.frmMesa.controls['cantComensales'].value}-
    ${this.frmMesa.controls['tipoMesaControl'].value}`;
    
    
    try {
      const url = await this.storage.subirArchivo(image,`${Colecciones.Mesas}/${nombreFoto}`);
      const fotoDePerfil: Foto = {
        id: '',
        name: nombreFoto,
        date: datetime,
        url: url,
      };
      await this.db.subirDoc(Colecciones.Mesas, fotoDePerfil, true);
      this.spinner.hide();
      ToastSuccess.fire('Imagen subida con éxito!');
      return url;
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Hubo un problema al subir la imagen.');
      return null;
    }
  }


  async manejarNroMesa() {
    let nroMesaExiste = false;
    this.spinner.show();

    await this.db.traerColeccion<Mesa>(Colecciones.Mesas).then( mesas => {
      mesas.forEach( (m, index) => {
        if(m.nroMesa == this.frmMesa.controls['nroMesa'].value){
          nroMesaExiste = true;
          ToastError.fire('Este Numero de mesa ya se encuentra registrado.');
        }
      });
      if(!nroMesaExiste){
        document.getElementById('nroMesa')!.classList.add('deshabilitado');
        (document.getElementById('input-nroMesa')! as HTMLIonInputElement).disabled = true;
        (document.getElementById('btn-nroMesa')! as HTMLIonButtonElement).style.display = 'none';
          
        document.getElementById('cantComensales')!.classList.remove('deshabilitado');
        document.getElementById('tipoMesa')!.classList.remove('deshabilitado');

        ToastSuccess.fire('El numero de mesa no está en uso.');
      }
    })

    this.spinner.hide();
  }


  subirMesa() { 
    let foto;
    this.uploadPicture(this.picture).then((url) => {
      foto = url;
    });
    if (foto) {
      
      const nroMesa = this.frmMesa.controls['nroMesa'].value;
      const cantComensales = this.frmMesa.controls['cantComensales'].value;
      const tipoMesaControl = this.frmMesa.controls['tipoMesaControl'].value;
      let mesa = new Mesa(
        nroMesa,
        cantComensales,
        tipoMesaControl,
        foto,
        this.QRs
      );

      this.db
        .subirDoc(Colecciones.Mesas, mesa, false)
        .then((r) => {
          console.log('id' + r);
        });
    }
  }

  selecTipo($ev: CustomEvent) {
    this.frmMesa.controls['tipoMesaControl'].setValue($ev.detail.value);
  }

  private generateQRData() {
    const mesaQR = 
    `nro: ${this.frmMesa.controls['nroMesa'].value}\n` +
    `cantComensales: ${this.frmMesa.controls['cantComensales'].value}\n` +
    `tipoMesa: ${this.frmMesa.controls['tipoMesaControl'].value}`;
    this.QRs.push(mesaQR);
  }
}
