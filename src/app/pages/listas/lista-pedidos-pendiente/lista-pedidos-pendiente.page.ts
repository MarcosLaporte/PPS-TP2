import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonIcon, IonCardContent, IonCardHeader, IonButton, IonLabel, IonList, IonItem, IonCardTitle } from '@ionic/angular/standalone';
import { EstadoPedido, Pedido } from 'src/app/utils/classes/pedido';
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
import { PushService } from 'src/app/services/push.service';

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
  protected productos: Producto[] = [];
  protected empleado!: Empleado;

  constructor(private db: DatabaseService, private spinner: NgxSpinnerService,
    private modalCtrl: ModalController, private auth: AuthService, private push : PushService) {
    this.empleado = <Empleado>this.auth.UsuarioEnSesion;
    addIcons({ checkmarkCircleOutline, removeCircleOutline, receiptOutline });
  }

  async ngOnInit() {
    this.spinner.show();

    [this.productos, this.mesas, this.clientes] = await Promise.all([
      this.db.traerColeccion<Producto>(Colecciones.Productos),
      this.db.traerColeccion<Mesa>(Colecciones.Mesas),
      this.db.traerCoincidencias<Cliente>(Colecciones.Usuarios, { campo: 'rol', operacion: '==', valor: 'cliente' })
    ]);

    this.db.escucharColeccion<Pedido>(
      Colecciones.Pedidos,
      this.pedidos,
      (item) => {
        if (this.empleado.tipo === 'mozo')
          return item.estado === 'pendiente' || item.estado === 'listo';
        else {
          const sector = this.empleado.tipo === 'cocinero' ? 'cocina' : 'barra';
          return item.estado === 'en proceso' && !item.confirmaciones[sector];
        }
      }
    );

    this.spinner.hide();
  }

  async manejarEstadoPedido(pedido: Pedido) {
    this.spinner.show();
    let nuevoEstado: EstadoPedido;
    let nuevaConfirm: {
      cocina: boolean,
      barra: boolean
    } = pedido.confirmaciones;
    let msj: string;

    if (this.empleado.tipo === 'mozo') {
      [nuevoEstado, msj] = pedido.estado === 'pendiente' ?
        ['en proceso', 'Pedido en preparación.'] : ['entregado', 'Pedido listo!'];
      this.push.sendNotificationToType('Nuevo pedido','se ha confirmado un pedido, a la cocina!!','cocinero');
      this.push.sendNotificationToType('Nuevo pedido','se ha confirmado un pedido, a la barra!!','bartender');
    } else {
      const sector = this.empleado.tipo === 'cocinero' ? 'cocina' : 'barra';
      nuevaConfirm[sector] = true;
      nuevoEstado = 'en proceso';
      msj = `Pedido en ${sector} listo!`;
      this.push.sendNotificationToType('Pedido hecho','pase a retirarlo por las distintas zonas','mozo');
      if (pedido.confirmaciones.cocina && pedido.confirmaciones.barra) {
        nuevoEstado = 'listo';
        msj = 'Pedido listo para entrega!';
      }
    }

    await this.db.actualizarDoc(Colecciones.Pedidos, pedido.id, { confirmaciones: nuevaConfirm, estado: nuevoEstado });

    this.spinner.hide();
    ToastSuccess.fire(msj);
  }

  readonly accionPedido = (pedido: Pedido) => {
    if (this.empleado.tipo === 'mozo') {
      if (pedido.estado === 'pendiente')
        return 'Enviar pedido a preparar';
      else if (pedido.estado === 'listo')
        return 'Llevar pedido a la mesa';

      return;
    } else {
      return 'Pedido listo?';
    }
  }

  async mostrarPedido(pedido: Pedido) {
    let productosCant: PedidoProd[] = [];

    pedido.pedidoProd.forEach(pedidoProd => {
      this.productos.forEach(prod => {
        if (prod.nombre === pedidoProd.nombre) {
          if ((this.empleado.tipo === 'bartender' && prod.sector !== 'barra') ||
            (this.empleado.tipo === 'cocinero' && prod.sector !== 'cocina'))
            return;

          let prodPed: PedidoProd = {
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
      componentProps: { pedido: productosCant },
    });
    await modal.present();
  }
}
