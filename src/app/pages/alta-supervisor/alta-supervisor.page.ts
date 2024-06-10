import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonInputPasswordToggle,
  IonItem,
  IonRadioGroup,
  IonRadio,
} from '@ionic/angular/standalone';
import { Camera, CameraResultType } from '@capacitor/camera';
import Swal from 'sweetalert2';
import { Timestamp } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { FotoDePerfil } from 'src/app/interfaces/foto-de-perfil';

const datePipe = new DatePipe('en-US', '-0300');

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
  standalone: true,
  imports: [
    IonRadio,
    IonRadioGroup,
    IonItem,
    IonButton,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInputPasswordToggle,
    CommonModule,
    FormsModule,
  ],
})
export class AltaSupervisorPage implements OnInit {
  // private modalCtrl: ModalController,
  // private spinner: NgxSpinnerService,
  // public navCtrl: NavController

  pictures: FotoDePerfil[] = [];

  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private auth: AuthService,
  ) {}

  readonly supportedImageFormats = ['jpg', 'jpeg', 'png'];

  private readonly timestampParse = async (pic: FotoDePerfil) => {
    // pic.date = pic.date instanceof Timestamp ? pic.date.toDate() : pic.date;
    return pic;
  };

  ngOnInit() {}

  async takePic() {
    try {
      // let proceed: boolean = false;
      let proceed: boolean = true; //CAMBIAR CON EL DE ARRIBA
      do {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
        });
        if (!this.supportedImageFormats.includes(image.format))
          throw new Error('El archivo debe ser de formato .JPG, .JPEG ó .PNG');

        // this.spinner.show();
        // await MySwal.fire({
        //   text: 'Desea tomar más fotos?',
        //   imageUrl: image.webPath,
        //   imageWidth: '75vw',
        //   allowOutsideClick: false,
        //   allowEscapeKey: false,
        //   showConfirmButton: true,
        //   confirmButtonText: 'Sí',
        //   confirmButtonColor: '#a5dc86',
        //   showDenyButton: true,
        //   denyButtonText: 'No',
        //   denyButtonColor: '#f27474',
        //   showCancelButton: true,
        //   cancelButtonText: 'Volver a tomar esta foto',
        //   cancelButtonColor: '#f0ec0d',
        // }).then(async (res) => {
        //   proceed = !res.isDenied;
        //   const imgFile = await this.getFileFromUri(
        //     image.webPath!,
        //     image.format
        //   );
        //   if (!res.isDismissed) this.uploadPicture(imgFile);
        // });
      } while (proceed);
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

  // async uploadPicture(image: File) {
  //   // this.spinner.show();

  //   const datetime: Date = new Date();
  //   const dateStr: string = datePipe.transform(datetime, 'yyyyMMdd-HHmmss')!;
  //   // const picName: string = `${this.auth.UserInSession!.name}-${this.auth.UserInSession!.lastname}-${dateStr}`;
  //   const nombreFoto: string = `${this.auth.UsuarioEnSesion!.nombre}-${this.auth.UsuarioEnSesion!.apellido}-${dateStr}` 

  //   try {
  //     const url = await this.storage.uploadImage(
  //       image,
  //       `${this.storageName}/${this.newPicPrefix}-${picName}`
  //     );
  //     const buildingPic: BuildingPicture = {
  //       id: '',
  //       name: picName,
  //       authorDocId: this.auth.UserInSession!.id,
  //       author: `${this.auth.UserInSession!.name} ${
  //         this.auth.UserInSession!.lastname
  //       }`,
  //       votes: [],
  //       date: datetime,
  //       url: url,
  //     };
  //     await this.db.addData(this.storageName, buildingPic, true);
  //     this.spinner.hide();
  //     ToastSuccess.fire('Imagen subida con éxito!');
  //   } catch (error: any) {
  //     this.spinner.hide();
  //     ToastError.fire('Hubo un problema al subir la imagen.');
  //   }
  // }
}
