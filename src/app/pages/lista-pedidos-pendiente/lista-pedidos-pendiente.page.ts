import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonIcon, IonCardContent, IonCardHeader, IonButton, IonLabel, IonList, IonItem, IonCardTitle } from '@ionic/angular/standalone';
import { Pedido } from 'src/app/utils/classes/pedido';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';

@Component({
  selector: 'app-lista-pedidos-pendiente',
  templateUrl: './lista-pedidos-pendiente.page.html',
  styleUrls: ['./lista-pedidos-pendiente.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonItem, IonList, IonLabel, IonButton, IonCardHeader, IonCardContent, IonIcon, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListaPedidosPendientePage implements OnInit {

  protected pedidos!: Pedido[];
  protected clientes!: Cliente[];

  constructor(private db: DatabaseService) {
    db.traerColeccion<Pedido>(Colecciones.Pedidos).then( pedidos => {
      this.pedidos = pedidos;
    });
    
  }

  ngOnInit() {
  }

  aceptarPedido(id: string){}
  rechazarRevisar(id: string){}
}
