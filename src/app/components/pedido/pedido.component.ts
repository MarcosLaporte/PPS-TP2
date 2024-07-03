import { Component, Input, OnInit } from '@angular/core';
import { IonContent, IonCardContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { NgxSpinnerService } from 'ngx-spinner';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { ToastSuccess } from 'src/app/utils/alerts';
import { Pedido, PedidoArmado, PedidoProd } from 'src/app/utils/classes/pedido';
import { Producto } from 'src/app/utils/classes/producto';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Mesa } from 'src/app/utils/classes/mesa';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  imports: [IonButton, IonLabel, IonItem, IonList, IonCardContent, IonContent, CommonModule],
  standalone: true,
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent implements OnInit {
  pedido: PedidoProd[] = [];
  protected valorTotal: number = 0;
  protected tiempoEst: number = 0;

  constructor(protected modalCtrl: ModalController, protected auth: AuthService) { }

  ngOnInit() {
    this.pedido.forEach(item => {
      this.valorTotal += item.producto.precio * item.cantidad;
      if (item.producto.tiempoElab > this.tiempoEst) {
        this.tiempoEst = item.producto.tiempoElab;
      }
    });
  }

  hacerPedido() {
    let pedidoArmado: PedidoArmado[] = [];
    this.pedido.forEach(pedido => {
      let pedidoArmadoItem: PedidoArmado = {
        nombre: pedido.producto.nombre,
        cantidad: pedido.cantidad,
        tiempoEstimado: pedido.producto.tiempoElab,
        sector: pedido.producto.sector
      };
      pedidoArmado.push(pedidoArmadoItem);
    });

    const pedidoHecho = new Pedido(pedidoArmado, this.valorTotal, this.tiempoEst);
    this.modalCtrl.dismiss(pedidoHecho, 'confirm');
  }
}
