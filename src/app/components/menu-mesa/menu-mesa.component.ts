import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonItem, IonLabel, IonIcon, IonButton, IonFooter } from '@ionic/angular/standalone';
import { EstadoMesa, Mesa } from 'src/app/utils/classes/mesa';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { ModalController } from '@ionic/angular/standalone';
import { Pedido } from 'src/app/utils/classes/pedido';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { EncuestaCliente } from 'src/app/utils/classes/encuestas/encuesta-cliente';

@Component({
  selector: 'app-menu-mesa',
  templateUrl: './menu-mesa.component.html',
  styleUrls: ['./menu-mesa.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonTitle, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonItem, IonLabel, IonIcon, IonButton, IonFooter],
})
export class MenuMesaComponent implements OnInit {

  protected mesa!: Mesa;
  protected cliente!: Cliente;
  protected pedido!: Pedido;

  estados: EstadoMesa[] = [0, 1, 2, 3, 4, 5, 6];
  hizoEncuesta: boolean = false;
  constructor(protected modalCtrl: ModalController, private db: DatabaseService) { }

  async ngOnInit() {
    this.db.traerCoincidencias<EncuestaCliente>(Colecciones.EncuestasCliente,
      { campo: 'idPedido', operacion: '==', valor: this.pedido.id }).then((res) => {
        console.log(res);
        this.hizoEncuesta = res.length > 0;
      });
  }
}
