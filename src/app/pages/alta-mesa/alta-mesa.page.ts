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
import { Router } from '@angular/router';

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
  QRs: string[] = [];
  selectedData = 'foto';
  mesaCreada: boolean = false;
  mesaImg:string = "";
  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
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
      this.frmMesa.controls['foto'].setValue('valid');
    }
  }

  async uploadPicture(image: File) {
    this.spinner.show();
    const nombreFoto: string = `${Prefijos.Mesa}-${this.frmMesa.controls['nroMesa'].value}`;
    try {
      const url = await this.storage.subirArchivo(image,`${Colecciones.Mesas}/${nombreFoto}`);
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
        if(m.nroMesa == Number(this.frmMesa.controls['nroMesa'].value)){
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


  async subirMesa() { 
    this.uploadPicture(this.picture).then(async (url) => {
      if (url != null) {
        this.mesaImg = url;
        await MySwal.fire({
          title: 'todos los datos son correctos?',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: true,
          confirmButtonText: 'Sí',
          confirmButtonColor: '#a5dc86',
          showDenyButton: true,
          denyButtonText: 'Revisar',
          denyButtonColor: '#f27474',
        }).then(async (res) => {
          if(res.isConfirmed){
            const nroMesa = this.frmMesa.controls['nroMesa'].value;
            const cantComensales = this.frmMesa.controls['cantComensales'].value;
            const tipoMesaControl = this.frmMesa.controls['tipoMesaControl'].value;
  
            let mesa = new Mesa(
              '',
              nroMesa,
              cantComensales,
              tipoMesaControl,
              url,
              this.QRs
            );
      
            const mesaId = await this.db.subirDoc(Colecciones.Mesas, mesa, true);
            if(mesaId){
              this.generateQRData(mesaId);
              this.mesaCreada = true;
              document.getElementById('cantComensales')!.classList.add('deshabilitado');
              document.getElementById('tipoMesa')!.classList.add('deshabilitado');
              (document.getElementById('btn-tomarFoto')! as HTMLIonButtonElement).classList.add('deshabilitado');
              (document.getElementById('btn-agregarMesa')! as HTMLIonButtonElement).classList.add('deshabilitado');
            }
          }
          this.spinner.hide();
        });
      }
    })
  }

  selecTipo($ev: CustomEvent) {
    this.frmMesa.controls['tipoMesaControl'].setValue($ev.detail.value);
  }

  private generateQRData(mesaId:string) {
    const QRid = `mesa-${mesaId}`;
    // const QRMenu;
    // const QRPropina1;
    // const QRPropina2;
    // const QRPropina3;
    this.QRs.push(QRid);
    this.db.actualizarDoc(Colecciones.Mesas, mesaId, {'codigoQr':this.QRs})
    //TODO: El QR tiene que ser el ID del producto en firebase.
  }

  selectOption(event: CustomEvent){
    this.selectedData = event.detail.value;
  }

  volver(){
    this.router.navigateByUrl('home');
  }
}
