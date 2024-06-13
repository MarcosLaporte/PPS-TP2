import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonRadioGroup,
  IonRadio,
} from '@ionic/angular/standalone';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MySwal, ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { Timestamp } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';
import {
  Colecciones,
  DatabaseService,
} from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { Jefe, TipoJefe } from 'src/app/utils/classes/usuarios/jefe';
import { Foto } from 'src/app/utils/interfaces/interfaces';
import { Prefijos } from 'src/app/utils/enums/enums';

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
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AltaSupervisorPage implements OnInit {
  // private modalCtrl: ModalController,
  // private spinner: NgxSpinnerService,
  // public navCtrl: NavController

  picture!: File;
  supervisorDueno: TipoJefe = 'supervisor';

  frmSupervisor: FormGroup;
  nombre = new FormControl('', [Validators.required]);
  apellido = new FormControl('', [Validators.required]);
  DNI = new FormControl('',[Validators.required]);
  CUIL = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);

  nombreErrorMessage: string = '';
  apellidoErrorMessage: string = '';
  DNIErrorMessage: string = '';
  emailErrorMessage: string = '';
  CUILErrorMessage: string = '';

  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.frmSupervisor = this.formBuilder.group({
      nombre: this.nombre,
      apellido: this.apellido,
      DNI: this.DNI,
      CUIL: this.CUIL,
      email: this.email,
    });
  }

  readonly supportedImageFormats = ['jpg', 'jpeg', 'png'];

  // private readonly timestampParse = async (pic: FotoDePerfil) => {
  //   // pic.date = pic.date instanceof Timestamp ? pic.date.toDate() : pic.date;
  //   return pic;
  // };

  ngOnInit() {}

  fillFields() {
    this.nombre.setValue('nombre');
    this.apellido.setValue('apellido');
    this.DNI.setValue('12345678');
    this.CUIL.setValue('12123456781');
    this.email.setValue('email@gmail.com');
  }

  updateErrorMessage(frmControl: FormControl) {
    if (frmControl.hasError('required')) {
      if (frmControl == this.nombre) {
        this.nombreErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.apellido) {
        this.apellidoErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.DNI) {
        this.DNIErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.CUIL) {
        this.CUILErrorMessage = 'este campo es obligatorio';
      } else if (frmControl == this.email) {
        this.emailErrorMessage = 'este campo es obligatorio';
      }
    } else if (frmControl.hasError('email')) {
      this.emailErrorMessage = 'el formato es incorrecto';
    }
  }

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

    const nombreFoto: string = `${this.nombre.value}-${this.apellido.value}-${dateStr}`;

    try {
      const url = await this.storage.subirArchivo(
        image,
        `${Colecciones.Usuarios}/${Prefijos.supervisor}-${nombreFoto}`
      );
      const fotoDePerfil : Foto= {
        id: '',
        name: nombreFoto,
        date: datetime,
        url: url,
      };
      console.log(fotoDePerfil);
      await this.db.subirDoc(Colecciones.Usuarios, fotoDePerfil, true);
      return url;
      // this.spinner.hide();
      // ToastSuccess.fire('Imagen subida con éxito!');
    } catch (error: any) {
      // this.spinner.hide();
      // ToastError.fire('Hubo un problema al subir la imagen.');
      return null;
    }
  }

  subirSupervisor() {
    let foto;
    this.uploadPicture(this.picture).then((url) => {
      foto = url;
    });
    if (foto) {
      let supervisorDueno = new Jefe(
        '',
        this.nombre.value!,
        this.apellido.value!,
        Number(this.DNI.value)!,
        Number(this.CUIL.value)!,
        this.email.value!,
        foto,
        this.supervisorDueno
      );

      this.db
        .subirDoc(Colecciones.Usuarios, supervisorDueno, true)
        .then((r) => {
          console.log('id' + r);
        });
    }
  }
}
