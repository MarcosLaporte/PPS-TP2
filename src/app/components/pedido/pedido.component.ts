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

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  imports: [IonButton, IonLabel, IonItem, IonList, IonCardContent, IonContent],
  standalone: true,
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent  implements OnInit {

  prodCant: { [id: string]: number } = {};
  productos: Producto[] = [];
  mesa!: Mesa;
  protected precio: number = 0; 
  protected tiempoEst: number = 0;
  protected pedido: PedidoProd[] = []; 
  protected pedidoHecho!: Pedido;

  constructor(private spinner: NgxSpinnerService, private db: DatabaseService, private navCtrl: NavController, 
    private auth: AuthService) {
  }

  ngOnInit() {
    this.productos.forEach(prod => {
      const cant: number | undefined = this.prodCant[prod.id];
      if(cant){
        this.pedido.push({producto : prod, cantidad: cant});
      }
    });
    
    this.pedido.forEach( item => {
      this.precio += item.producto.precio * item.cantidad;
      if(item.producto.tiempoElab > this.tiempoEst){
        this.tiempoEst = item.producto.tiempoElab;
      }
    })
  }
  hacerPedido(){
    this.spinner.show();

    let pedidoArmado : PedidoArmado[] = [];
    this.pedido.forEach( pedido=> {
      let pedidoArmadoItem : PedidoArmado= {
        nombre : pedido.producto.nombre, 
        cantidad : pedido.cantidad, 
        tiempoEstimado : pedido.producto.tiempoElab,
      }
      pedidoArmado.push(pedidoArmadoItem);
    });
    
    this.pedidoHecho = new Pedido('', pedidoArmado, this.precio, this.tiempoEst, this.auth.UsuarioEnSesion!.id, this.mesa.nroMesa);
    this.db.subirDoc(Colecciones.Pedidos, this.pedidoHecho, true).then( () => {
      this.spinner.hide();
      ToastSuccess.fire('En instantes un mozo le confirmará su pedido');
      this.navCtrl.navigateRoot('home');
    });
  }
}
