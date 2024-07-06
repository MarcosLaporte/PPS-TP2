import { EncuestaCliente } from 'src/app/utils/classes/encuestas/encuesta-cliente';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavController,ModalController, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle, IonButton, IonContent, IonFabButton, IonFab, IonIcon, IonFabList, IonModal, IonAccordionGroup, IonAccordion, IonLabel, IonList, IonText, IonInput, IonAvatar } from '@ionic/angular/standalone';
import { RangeEstrellasComponent } from 'src/app/components/range-estrellas/range-estrellas.component';
import { EncuestaEmpleadoComponent } from 'src/app/components/encuesta-empleado/encuesta-empleado.component';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Timestamp } from '@angular/fire/firestore';
import { EncuestaClienteComponent } from 'src/app/components/encuesta-cliente/encuesta-cliente.component';
import { addIcons } from 'ionicons';
import { home, statsChart } from 'ionicons/icons';

@Component({
  selector: 'app-lista-encuestas-cliente',
  templateUrl: './lista-encuestas-cliente.page.html',
  styleUrls: ['./lista-encuestas-cliente.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonAvatar, IonInput, IonText, IonList, IonLabel, IonAccordion, IonAccordionGroup, IonModal, IonFabList, IonIcon, IonFab, IonFabButton, IonContent, IonButton, IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, CommonModule, RangeEstrellasComponent],
  providers: [ModalController]
})
export class ListaEncuestasClientePage {
  lista: Array<EncuestaCliente> = [];

  constructor(private modalCtrl: ModalController,protected navCtrl: NavController) {
    addIcons({ home, statsChart });
    inject(DatabaseService).escucharColeccion(
      Colecciones.EncuestasCliente,
      this.lista,
      undefined,
      undefined,
      this.timestampParse
    );
  }

  private timestampParse = async (encuesta: EncuestaCliente) => {
    encuesta.fecha = encuesta.fecha instanceof Timestamp ? encuesta.fecha.toDate() : encuesta.fecha;
    return encuesta;
  }

  maxEstrellas = (cantidad: number) => Math.ceil(cantidad);

  async mostrarEncuesta(encuesta: EncuestaCliente) {
    const modal = await this.modalCtrl.create({
      component: EncuestaClienteComponent,
      id: 'encuesta-modal',
      componentProps: { encuesta: encuesta },
    });

    modal.present();
  }
}
