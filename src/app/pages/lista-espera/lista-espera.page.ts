import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { ClienteEnEspera } from 'src/app/utils/interfaces/interfaces';
import { NavController, ModalController } from '@ionic/angular/standalone';
import { MySwal, ToastError, ToastInfo, ToastSuccess } from 'src/app/utils/alerts';
import { EstadoMesa, Mesa } from 'src/app/utils/classes/mesa';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'src/main';
import { MesasDisponiblesComponent } from 'src/app/components/mesas-disponibles/mesas-disponibles.component';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ModalController]
})
export class ListaEsperaPage implements OnInit {
/* 
  listaDeEspera: ClienteEnEspera[] = [
    {
      id: 'x4ec5r6ty8u9i0o',
      cliente: {
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-32453888?alt=media&token=b8454705-af17-41ca-aacd-9510b9060a34",
        "dni": 32453888,
        "estadoCliente": "aceptado",
        "correo": "elpepe@outlook.com",
        "idMesa": null,
        "rol": "cliente",
        "apellido": "Lopez",
        "tipo": "registrado",
        "id": "VuIUEXELrX4AZsLs6F8X",
        "nombre": "Pepito"
      },
      fecha: new Date(1719793097126)
    },
    {
      id: 'asdasd33',
      cliente: {
        "estadoCliente": "aceptado",
        "apellido": "Registrado",
        "tipo": "registrado",
        "rol": "cliente",
        "dni": 34549760,
        "nombre": "Cliente",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-34549760?alt=media&token=19047d5b-8dad-4a42-9067-7900d79893db",
        "correo": "registrado@cliente.com",
        "id": "iFHMlgOm9QkCpJOpb651",
        "idMesa": "DLDy65F46o10UeAQVcyG"
      },
      fecha: new Date(1299793458126)
    },
    {
      id: '9huib',
      cliente: {
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-anon-Anonimo?alt=media&token=94726352-06cc-4693-a9fe-689467434d12",
        "idMesa": null,
        "nombre": "Anonimo",
        "estadoCliente": "aceptado",
        "correo": "",
        "rol": "cliente",
        "dni": 0,
        "id": "Uw0VTqyIfeJHtonocCOv",
        "apellido": "",
        "tipo": "anonimo"
      },
      fecha: new Date(1623793093256)
    }
  ];
  mesasDisp: Mesa[] = [
    {
      "nroMesa": 3,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 5,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 6,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 3,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 3,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 5,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 6,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 3,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 3,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 5,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 6,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
    {
      "nroMesa": 3,
      "estado": 0,
      "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/mesas%2Fmesa-3?alt=media&token=11584005-85ef-4dfc-927e-3985f813eb12",
      "id": "6JSkAmkz3oFcA1UYh045",
      "tipo": "VIP",
      "codigoQr": [
        "6JSkAmkz3oFcA1UYh045"
      ],
      "cantComensales": 6
    },
  ]  //FIXME: TEST

 */
  listaDeEspera: ClienteEnEspera[] = [];
  mesasDisp: Mesa[] = []

  constructor(private db: DatabaseService, protected navCtrl: NavController, private spinner: NgxSpinnerService, private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.spinner.show();
    this.db.escucharColeccion<ClienteEnEspera>(
      Colecciones.ListaDeEspera,
      this.listaDeEspera,
      undefined,
      (c1: ClienteEnEspera, c2: ClienteEnEspera) => c1.fecha.getTime() - c2.fecha.getTime(),
      this.timestampParse
    );

    this.db.escucharColeccion<Mesa>(
      Colecciones.Mesas,
      this.mesasDisp,
      (mesa) => mesa.estado === EstadoMesa.Disponible,
      (m1: Mesa, m2: Mesa) => m1.nroMesa - m2.nroMesa
    );

    await delay(3500);
    this.spinner.hide();
  }

  private timestampParse = async (cliEspera: ClienteEnEspera) => {
    cliEspera.fecha = cliEspera.fecha instanceof Timestamp ? cliEspera.fecha.toDate() : cliEspera.fecha;
    return cliEspera;
  }

  async selecCliente(cliente: ClienteEnEspera) {
    const mesasModal = await this.modalCtrl.create({
      component: MesasDisponiblesComponent,
      componentProps: {
        mesas: this.mesasDisp,
        clienteEspera: cliente
      },
      id: 'mesas-modal'
    });

    await mesasModal.present();
    const modalDismiss = (await mesasModal.onDidDismiss());
    switch (modalDismiss.role) {
      case 'success':
        ToastSuccess.fire('Cliente asignado!');
        break;
      case 'cancel':
        ToastInfo.fire('Operación cancelada.');
        break;
      case 'error':
        ToastError.fire('Ups...', modalDismiss.data);
        break;
    }
  }

}
