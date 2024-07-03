import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonIcon, IonCardContent, IonCardHeader, IonButton, IonLabel, IonList, IonItem, IonCardTitle } from '@ionic/angular/standalone';
import { Pedido } from 'src/app/utils/classes/pedido';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, receiptOutline, removeCircleOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'src/main';
import { EstadoMesa, Mesa } from 'src/app/utils/classes/mesa';
import { ModalController } from '@ionic/angular/standalone';
import { PedidoComponent } from 'src/app/components/pedido/pedido.component';
import { PedidoProd } from 'src/app/utils/classes/pedido';
import { Producto } from 'src/app/utils/classes/producto';
import { ToastSuccess } from 'src/app/utils/alerts';

@Component({
  selector: 'app-lista-pedidos-pendiente',
  templateUrl: './lista-pedidos-pendiente.page.html',
  styleUrls: ['./lista-pedidos-pendiente.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonItem, IonList, IonLabel, IonButton, IonCardHeader, IonCardContent, IonIcon, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  providers: [ModalController]
})
export class ListaPedidosPendientePage implements OnInit {

  protected pedidos: Pedido[] = [];
  protected mesas: Mesa[] = [];
  protected clientes: Cliente[] = [];

  constructor(private db: DatabaseService, private spinner: NgxSpinnerService, 
    private modalCtrl: ModalController) {
    addIcons({checkmarkCircleOutline, removeCircleOutline, receiptOutline});
  }

  async ngOnInit() {
    this.spinner.show();

    this.db.traerColeccion<Mesa>(Colecciones.Mesas).then( (mesas)=> {
      this.mesas = mesas;
    });
    this.db.traerColeccion<Cliente>(Colecciones.Usuarios).then( (clientes)=> {
      this.clientes = clientes;
    });
    this.db.escucharColeccion<Pedido>(Colecciones.Pedidos, this.pedidos, (item => {
      return item.estado == 'pendiente';
    }));

    await delay(2500);
    this.spinner.hide();
  }

  aceptarPedido(id: string){
    this.spinner.show();
    this.db.actualizarDoc(Colecciones.Pedidos, id, {estado: 'en proceso'}).then( () => {
      this.spinner.hide();
      ToastSuccess.fire('Se aceptó el pedido');
    })
  }
  
  async mostrarPedido(pedido: Pedido){

    let productosCant: PedidoProd[] = [];
    let productos : Producto[]= [];
    productos = await this.db.traerColeccion<Producto>(Colecciones.Productos);
    
    pedido.pedidoProd.forEach(pedidoProd => {
      productos.forEach( prod => {
        if(prod.nombre == pedidoProd.nombre){
          let prodPed = {
            producto: prod,
            cantidad: pedidoProd.cantidad 
          }
          productosCant.push(prodPed);
        }
      })
    });

    const modal = await this.modalCtrl.create({
      component: PedidoComponent,
      id: 'pedido-modal',
      componentProps: { pedido: productosCant! },
    });
    await modal.present();
  }
}
