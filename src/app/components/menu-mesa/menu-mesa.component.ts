import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonItem, IonLabel, IonIcon, IonButton, IonFooter } from '@ionic/angular/standalone';
import { EstadoMesa, Mesa } from 'src/app/utils/classes/mesa';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { ModalController } from '@ionic/angular/standalone';
import { Pedido } from 'src/app/utils/classes/pedido';

@Component({
  selector: 'app-menu-mesa',
  templateUrl: './menu-mesa.component.html',
  styleUrls: ['./menu-mesa.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonTitle, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonItem, IonLabel, IonIcon, IonButton, IonFooter],
})
export class MenuMesaComponent  implements OnInit {

  protected mesa!: Mesa;
  protected cliente!: Cliente;
  protected pedido!: Pedido;

  estados: EstadoMesa[] = [0, 1, 2, 3, 4, 5, 6]
  constructor(protected modalCtrl: ModalController) {
    
  }

  ngOnInit() {}

  accionar(accion: string){
    this.modalCtrl.dismiss(accion);  
  }
}
