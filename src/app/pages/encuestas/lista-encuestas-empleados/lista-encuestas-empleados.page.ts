import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { EncuestaEmpleado } from 'src/app/utils/classes/encuestas/encuesta-empleado';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle, IonButton, IonContent, IonFabButton, IonFab, IonIcon, IonFabList, IonModal, IonAccordionGroup, IonAccordion, IonLabel, IonList, IonText, IonInput, IonAvatar } from '@ionic/angular/standalone';
import { RangeEstrellasComponent } from 'src/app/components/range-estrellas/range-estrellas.component';
import { EncuestaEmpleadoComponent } from 'src/app/components/encuesta-empleado/encuesta-empleado.component';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-lista-encuestas-empleados',
  templateUrl: './lista-encuestas-empleados.page.html',
  styleUrls: ['./lista-encuestas-empleados.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonInput, IonText, IonList, IonLabel, IonAccordion, IonAccordionGroup, IonModal, IonFabList, IonIcon, IonFab, IonFabButton, IonContent, IonButton, IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, CommonModule, RangeEstrellasComponent],
  providers: [ModalController]
})
export class ListaEncuestasEmpleadosPage {
  lista: Array<EncuestaEmpleado> = [];

  constructor(private modalCtrl: ModalController) {
    inject(DatabaseService).escucharColeccion(
      Colecciones.EncuestasEmpleado,
      this.lista,
      undefined,
      undefined,
      this.timestampParse
    );
  }

  private timestampParse = async (encuesta: EncuestaEmpleado) => {
    encuesta.fecha = encuesta.fecha instanceof Timestamp ? encuesta.fecha.toDate() : encuesta.fecha;
    return encuesta;
  }

  maxEstrellas = (cantidad: number) => Math.ceil(cantidad);

  async mostrarEncuesta(encuesta: EncuestaEmpleado) {
    const modal = await this.modalCtrl.create({
      component: EncuestaEmpleadoComponent,
      id: 'encuesta-modal',
      componentProps: { encuesta: encuesta },
    });

    modal.present();
  }
}