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
