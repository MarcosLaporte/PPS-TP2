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
import { AuthService } from 'src/app/services/auth.service';
import { Empleado } from 'src/app/utils/classes/usuarios/empleado';

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
  protected empleado!: Empleado;
  protected productos : Producto[]= [];

  constructor(private db: DatabaseService, private spinner: NgxSpinnerService, 
    private modalCtrl: ModalController, private auth: AuthService) {
    this.empleado = <Empleado>this.auth.UsuarioEnSesion;
    addIcons({checkmarkCircleOutline, removeCircleOutline, receiptOutline});
  }

  async ngOnInit() {
    let prodctosFiltrados: Producto[] = [];
    this.spinner.show();

    this.productos = await this.db.traerColeccion<Producto>(Colecciones.Productos);
    this.mesas = await this.db.traerColeccion<Mesa>(Colecciones.Mesas);
    this.clientes = await this.db.traerColeccion<Cliente>(Colecciones.Usuarios);
    this.db.escucharColeccion<Pedido>(Colecciones.Pedidos, this.pedidos, (item => {
      if(this.auth.UsuarioEnSesion?.rol == 'empleado') {
        if(this.empleado.tipo == 'mozo')
          return item.estado == 'pendiente';
        else {
          return item.estado == 'en proceso';
        }
      }
      return false;
    }));
    // this.pedidos = (await this.db.traerColeccion<Pedido>(Colecciones.Pedidos)).filter(pedido => { return pedido.estado == 'pendiente'; })
    // this.pedidos.forEach( async (pedido, index) => {
    //   if(pedido.idCliente){
    //     let cliente = await this.db.traerDoc<Cliente>(Colecciones.Usuarios, pedido.idCliente);
    //     this.clientes.push(cliente);
    //   }
    //   if(index +1 == this.pedidos.length){
    //     this.clientes.forEach( async cliente => {
    //       if(cliente.idMesa){
    //         console.log(cliente.idMesa);
    //         let mesa = await this.db.traerDoc<Mesa>(Colecciones.Usuarios, cliente.idMesa);
    //         console.log(mesa);
    //         this.mesas.push(mesa);
    //       }
    //     })
    //   }
    // })
    this.spinner.hide();
  }

  estadoPedido(id: string){
    this.spinner.show();
    this.db.actualizarDoc(Colecciones.Pedidos, id, 
      {estado: this.empleado.tipo == 'mozo'?'en proceso':'entregado'}).then( () => {
        this.spinner.hide();
        ToastSuccess.fire('Se aceptó el pedido');
    })
  }
  
  async mostrarPedido(pedido: Pedido){
    let productosCant: PedidoProd[] = [];
    
    pedido.pedidoProd.forEach(pedidoProd => {
      this.productos.forEach( prod => {
        if(prod.nombre == pedidoProd.nombre){
          if(this.empleado.tipo == 'bartender' && prod.sector != 'barra')
            return 
          else if(this.empleado.tipo == 'cocinero' && prod.sector != 'cocina')
            return
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
