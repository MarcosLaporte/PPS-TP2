import { Component, Input, OnInit } from '@angular/core';
import { IonContent, IonCardContent } from '@ionic/angular/standalone';
import { MySwal, ToastError, ToastSuccess } from 'src/app/utils/alerts';
import { Producto } from 'src/app/utils/classes/producto';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  imports: [IonCardContent, IonContent],
  standalone: true,
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent  implements OnInit {

  @Input() productos!: Producto[];

  constructor() { }

  ngOnInit() {}

}
