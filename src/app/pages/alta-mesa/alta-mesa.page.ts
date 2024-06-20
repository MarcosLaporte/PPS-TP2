import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonRadioGroup, IonButton, IonSelectOption, IonInput, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonIcon, IonRadio, IonSelect } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Colecciones, Prefijos, DatabaseService, } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { MySwal, ToastError, ToastSuccess, ToastInfo } from 'src/app/utils/alerts';
import { Foto } from 'src/app/utils/interfaces/interfaces';
import { Mesa, TipoMesa } from 'src/app/utils/classes/mesa';
import { NgxSpinnerService } from 'ngx-spinner';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';
import { QrCodeModule } from 'ng-qrcode';
import { tomarFoto } from 'src/main';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.page.html',
  styleUrls: ['./alta-mesa.page.scss'],
  standalone: true,
  imports: [IonRadio, IonIcon, IonCardContent, IonCardTitle, IonCard, IonCardHeader,  IonButton, IonRadioGroup, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, IonInput, CommonModule, FormsModule, ReactiveFormsModule, QrCodeModule, IonSelect],
})
export class AltaMesaPage {

  frmMesa: FormGroup;
  
  picture!: File;
  tempImg: string = "";
  QRs: string[] = [];
  selectedData = 'foto';

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

  async takePic() {
    const foto = await tomarFoto();
    if (foto) {
      this.picture = foto;
      this.generateQRData();
    }
  }

  async uploadPicture(image: File) {
    this.spinner.show();

    const datetime: Date = new Date();

    const nombreFoto: string = 
      `${Prefijos.Mesa}-${this.frmMesa.controls['nroMesa'].value}`;
    
    
    try {
      const url = await this.storage.subirArchivo(image,`${Colecciones.Mesas}/${nombreFoto}`);
      const fotoDePerfil: Foto = {
        id: '',
        name: nombreFoto,
        date: datetime,
        url: url,
      };
      // await this.db.subirDoc(Colecciones.Mesas, fotoDePerfil, true);
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
        '',
        nroMesa,
        cantComensales,
        tipoMesaControl,
        foto,
        this.QRs
      );

      this.db
        .subirDoc(Colecciones.Mesas, mesa, true)
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
    //TODO: El QR tiene que ser el ID del producto en firebase.
  }

  selectOption(event: CustomEvent){
    this.selectedData = event.detail.value;
  }
}
