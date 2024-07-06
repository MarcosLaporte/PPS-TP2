import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonIcon, IonAvatar, IonList } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'src/main';
import { ToastSuccess } from 'src/app/utils/alerts';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-lista-clientes-pendientes',
  templateUrl: './lista-clientes-pendientes.page.html',
  styleUrls: ['./lista-clientes-pendientes.page.scss'],
  standalone: true,
  imports: [IonList, IonAvatar, IonIcon, IonButton, IonLabel, IonItem, IonAccordion, IonAccordionGroup, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListaClientesPendientesPage implements OnInit {

  protected clientes: Cliente[] = [];
  constructor(protected db: DatabaseService, private spinner: NgxSpinnerService, private push: PushService, protected navCtrl: NavController) {
    addIcons({ checkmarkCircleOutline, removeCircleOutline });
  }

  async ngOnInit() {
    this.spinner.show();
    this.db.escucharColeccion<Cliente>(
      Colecciones.Usuarios,
      this.clientes,
      (c) => c.estadoCliente === 'pendiente'
    );

    await delay(2500);
    this.spinner.hide();
  }

  async manejarCliente(cliente: Cliente, estado: 'aceptado' | 'rechazado') {
    this.spinner.show();
    await this.db.actualizarDoc(Colecciones.Usuarios, cliente.id, { 'estadoCliente': estado });
    ToastSuccess.fire(`Cliente ${estado}!`);
    
    this.push.sendMail(estado === 'aceptado', cliente.nombre, cliente.correo);

    this.spinner.hide();
  }
}
