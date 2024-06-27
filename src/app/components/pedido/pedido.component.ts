import { Component, Input, OnInit } from '@angular/core';
import { IonContent, IonCardContent } from '@ionic/angular/standalone';
import { Producto } from 'src/app/utils/classes/producto';

declare interface PedidoProd{
  producto: Producto,
  cantidad: number,
};

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  imports: [IonCardContent, IonContent],
  standalone: true,
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent  implements OnInit {

  prodCant: { [id: string]: number } = {};
  productos: Producto[] = [];
  protected pedido: PedidoProd[] = []; 

  constructor() {
  }

  ngOnInit() {
    this.productos.forEach(prod => {
      const cant: number | undefined = this.prodCant[prod.id];
      if(cant){
        this.pedido.push({producto : prod, cantidad: cant});
      }
    });

    console.log(this.pedido);
  }

}
