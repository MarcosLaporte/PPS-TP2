import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle, IonButton, IonContent, IonFabButton, IonFab, IonIcon, IonFabList, IonModal, IonAccordionGroup, IonAccordion, IonLabel, IonTabButton } from '@ionic/angular/standalone';
import { menuOutline, chevronDownCircle, logInOutline, logOutOutline, scan, caretDownCircle, restaurant, chatbubblesOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { MySwal, Toast, ToastError, ToastInfo, ToastSuccess } from 'src/app/utils/alerts';
import { AlertController, NavController, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Exception, ErrorCodes } from 'src/app/utils/classes/exception';
import { EstadoMesa, Mesa, parseEstadoMesa } from 'src/app/utils/classes/mesa';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { ClienteEnEspera, Roles_Tipos } from 'src/app/utils/interfaces/interfaces';
import { CheckRolTipo } from 'src/app/utils/check_rol_tipo';
import { Empleado } from 'src/app/utils/classes/usuarios/empleado';
import { Pedido, PorcPropina } from 'src/app/utils/classes/pedido';
import { MenuMesaComponent } from '../menu-mesa/menu-mesa.component';
import { CuentaComponent } from '../cuenta/cuenta.component';
import { PushService } from 'src/app/services/push.service';

declare interface Pagina { titulo: string, url: string, icono: string, rol_tipo?: Roles_Tipos[], permitirAnon?: boolean };
declare interface Funcion { titulo: string, icono: string, accion: () => Promise<any> };
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonTabButton, IonLabel, IonAccordion, IonAccordionGroup, IonModal, IonFabList, IonIcon, IonFab, IonFabButton, IonContent, IonButton, IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, CommonModule, NgxSpinnerModule],
  providers: [ModalController]
})
export class MenuComponent {
  readonly CheckRolTipo = CheckRolTipo;
  private readonly altas: Pagina[] = [
    { titulo: 'Cliente', url: '/alta-cliente', icono: 'review', rol_tipo: [{ rol: 'empleado', tipo: 'metre' }], permitirAnon: true },
    {
      titulo: 'Producto', url: '/alta-producto', icono: 'utensils', rol_tipo: [
        { rol: 'empleado', tipo: 'cocinero' },
        { rol: 'empleado', tipo: 'bartender' }
      ]
    },
    { titulo: 'Pedido', url: '/alta-pedido', icono: 'restaurant', rol_tipo: [{ rol: 'empleado', tipo: 'mozo' }] },
    { titulo: 'Supervisor', url: '/alta-supervisor', icono: 'boss', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Mesa', url: '/alta-mesa', icono: 'table-picnic', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Empleado', url: '/alta-empleado', icono: 'room-service', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Encuesta', url: '/alta-encuesta-empleado', icono: 'corporate', rol_tipo: [{ rol: 'empleado' }] },
    { titulo: 'Encuesta', url: '/alta-encuestas-supervisor', icono: 'corporate', rol_tipo: [{ rol: 'jefe' }] },
  ];

  pagsAltas: Pagina[] = [];
  paginasGenerales: Pagina[] = [
    { titulo: 'Perfil', url: '/perfil', icono: 'circle-user' },
    { titulo: 'Inicio', url: '/home', icono: 'house-chimney', permitirAnon: true },
    { titulo: 'Clientes pendientes', url: '/lista-clientes-pendientes', icono: 'selection', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Encuestas empleados', url: '/lista-encuestas-empleados', icono: 'corporate', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Lista de espera', url: '/lista-espera', icono: 'skill', rol_tipo: [{ rol: 'empleado', tipo: 'metre' }] },
    {
      titulo: 'Lista de pedidos pendientes', url: '/lista-pedidos-pendiente', icono: 'dinner', rol_tipo: [
        { rol: 'empleado', tipo: 'mozo' },
        { rol: 'empleado', tipo: 'bartender' },
        { rol: 'empleado', tipo: 'cocinero' }]
    },
    { titulo: 'Lista de clientes pagando', url: '/lista-clientes-pagando', icono: 'dinner', rol_tipo: [{ rol: 'empleado', tipo: 'mozo' }] },
  ];
  funciones: Funcion[] = [];

  constructor(
    protected router: Router,
    protected navCtrl: NavController,
    protected auth: AuthService,
    private alertCtrl: AlertController,
    private scanner: ScannerService,
    private db: DatabaseService,
    private spinner: NgxSpinnerService,
    protected modalCtrl: ModalController,
    private push : PushService
  ) {
    addIcons({ menuOutline, caretDownCircle, chevronDownCircle, logInOutline, logOutOutline, scan, restaurant, chatbubblesOutline });

    const funcEscanear =
      { titulo: 'Escanear', icono: 'scan', accion: () => this.escanear() };
    const funcIniciarSesion =
      { titulo: 'Iniciar sesión', icono: 'log-in-outline', accion: () => navCtrl.navigateRoot('login') };
    const funcCerrarSesion =
      { titulo: 'Cerrar sesión', icono: 'log-out-outline', accion: () => this.cerrarSesion() };
    const funcChatMozos =
      { titulo: 'Chat', icono: 'chatbubbles-outline', accion: () => navCtrl.navigateForward('consulta-mozo') };

    auth.usuarioEnSesionObs.subscribe((usuario) => {
      this.pagsAltas = this.altas.filter((pag) => CheckRolTipo(auth, pag.rol_tipo, pag.permitirAnon));

      if (!usuario) {
        this.funciones[0] = funcIniciarSesion;
        this.funciones.splice(1, 2);
      } else {
        this.funciones[0] = funcCerrarSesion;
        this.funciones[1] = funcEscanear;
        if (this.usuarioChatPermitido())
          this.funciones[2] = funcChatMozos;
      }
    });
  }

  private usuarioChatPermitido = () => {
    const usuario = this.auth.UsuarioEnSesion;
    return usuario && ((usuario.rol === 'cliente' && (usuario as Cliente).idMesa !== null) ||
      (usuario.rol === 'empleado' && (usuario as Empleado).tipo === 'mozo'));
  }

  itemClick(url: string) {
    const accordion = document.getElementById('lista-global') as HTMLIonAccordionGroupElement;
    accordion.value = [];
    this.navCtrl.navigateRoot(url)
  }

  async cerrarSesion() {
    const alert = await this.alertCtrl.create({
      header: '¿Desea cerrar sesión?',
      message: 'No podrá realizar ninguna acción hasta que vuelva a abrir su cuenta.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => ToastInfo.fire('Operación cancelada.')
        },
        {
          text: 'Sí',
          role: 'confirm',
          handler: async () => {
            this.auth.signOut();
            ToastSuccess.fire('Sesión cerrada!');
          },
        }
      ],
    });

    await alert.present();
  }

  async escanear() {
    if (!this.auth.UsuarioEnSesion) return;
    try {
      const QR: string = await this.scanner.escanear();
      const qrSeparado = QR.split('-');

      switch (qrSeparado[0]) {
        case 'entrada': //Código de entrada
          if (this.auth.UsuarioEnSesion.rol !== 'cliente' ||
            !['aceptado', 'no necesita'].includes((this.auth.UsuarioEnSesion as Cliente).estadoCliente))
            throw new Exception(ErrorCodes.TipoUsuarioIncorrecto, 'Solo los clientes aceptados pueden acceder a la lista de espera.');

          if ((this.auth.UsuarioEnSesion as Cliente).idMesa !== null)
            throw new Exception(ErrorCodes.ClienteYaTieneMesa, 'No puede entrar a la lista de espera, ya tiene una mesa asignada!');

          this.accederListaDeEspera();
          break;
        case 'mesa':
          if (this.auth.UsuarioEnSesion?.rol !== 'cliente')
            throw new Exception(ErrorCodes.TipoUsuarioIncorrecto, 'Solo los clientes pueden acceder a las mesas.');

          this.escanearQrMesa(qrSeparado[1]);
          break;
        default:
          throw new Exception(ErrorCodes.QrInvalido, 'El código escaneado no es reconocido.');
      }
    } catch (error: any) {
      ToastError.fire('Ups...', error.message);
    }
  }

  accederListaDeEspera() {
    MySwal.fire({
      icon: 'question',
      title: '¿Desea ver las encuestas de los clientes o acceder a la lista de espera?',
      showConfirmButton: true,
      confirmButtonText: 'Acceder a la lista',
      showDenyButton: true,
      denyButtonText: 'Ver encuestas'
    }).then(async (res) => {
      let url = 'lista-encuestas-cliente';
      if (res.isConfirmed) {
        if (await this.clienteEstaEnEspera(this.auth.UsuarioEnSesion!.id))
          throw new Exception(ErrorCodes.ClienteEnEspera, 'Ya se encuentra en la lista de espera!');

        const clienteEnEspera: ClienteEnEspera = { id: '', fecha: new Date(), cliente: this.auth.UsuarioEnSesion as Cliente };
        this.db.subirDoc(Colecciones.ListaDeEspera, clienteEnEspera, true);
        url = 'clientes-espera';
        this.push.sendNotificationToType('Nuevo cliente',
          `${clienteEnEspera.cliente.nombre} ${clienteEnEspera.cliente.apellido} se sumó a la lista de espera`,'metre');
      }

      this.navCtrl.navigateRoot(url);
    });
  }

  private async clienteEstaEnEspera(idCliente: string): Promise<boolean> {
    this.spinner.show();

    const col = await this.db.traerColeccion<ClienteEnEspera>(Colecciones.ListaDeEspera);
    const existe = col.find((v) => v.cliente.id === idCliente) !== undefined;

    this.spinner.hide();
    return existe;
  }

  async escanearQrMesa(idMesa: string) {
    try {
      this.spinner.show();
      const cliente = this.auth.UsuarioEnSesion as Cliente;
      if (!cliente) return;

      if (!cliente.idMesa)
        throw new Exception(ErrorCodes.ClienteSinMesa, "Debe entrar a la lista de espera y esperar a que le asignen una mesa.");

      const nroMesaCliente = (await this.db.traerDoc<Mesa>(Colecciones.Mesas, cliente.idMesa)).nroMesa;
      if (idMesa !== cliente.idMesa) {
        throw new Exception(ErrorCodes.MesaEquivocada, `Su mesa es la Nro${nroMesaCliente}`);
      }

      const mesaEscan = await this.db.traerDoc<Mesa>(Colecciones.Mesas, idMesa);
      if (!mesaEscan) throw new Exception(ErrorCodes.MesaInexistente, 'Este QR no pertenece a una de nuestras mesas.');

      switch (mesaEscan.estado) {
        case EstadoMesa.Disponible:
          ToastInfo.fire('Para acceder a esta mesa, se le debe ser asignada por el metre.');
          break;
        case EstadoMesa.Asignada:
          this.spinner.hide();

          this.mostrarMenu(mesaEscan).then((rta) => {
            this.spinner.show();
            if (rta === 'pedir-comida') {
              mesaEscan.estado = EstadoMesa.PidiendoComida;
              this.db.actualizarDoc(Colecciones.Mesas, mesaEscan.id, { estado: EstadoMesa.PidiendoComida });
              this.navCtrl.navigateRoot('alta-pedido');
            } else {
              mesaEscan.estado = EstadoMesa.SinPedido;
              this.db.actualizarDoc(Colecciones.Mesas, mesaEscan.id, { estado: EstadoMesa.SinPedido });
            }
            this.spinner.hide();
          });
          break;
        case EstadoMesa.SinPedido:
          this.spinner.hide();

          this.mostrarMenu(mesaEscan).then((rta) => {
            this.spinner.show();

            if (rta === 'pedir-comida')
              this.navCtrl.navigateRoot('alta-pedido');
            else if (rta === 'consultar')
              this.navCtrl.navigateForward('consulta-mozo');

            this.spinner.hide();
          });
          break;
        case EstadoMesa.EsperandoComida:
          const ped = (await this.db.traerCoincidencias<Pedido>(Colecciones.Pedidos, {
            campo: 'idCliente', operacion: '==', valor: cliente.id
          }))[0];
          this.spinner.hide();
          if (ped.estado == 'entregado') {
            await this.db.actualizarDoc(
              Colecciones.Mesas,
              mesaEscan.id,
              { estado: EstadoMesa.Comiendo }
            );
            ToastSuccess.fire('Pedido recibido.');
          } else {
            this.mostrarMenu(mesaEscan, ped);
          }
          break;
        case EstadoMesa.Comiendo:
          const pedido = (await this.db.traerCoincidencias<Pedido>(Colecciones.Pedidos, {
            campo: 'idCliente', operacion: '==', valor: cliente.id
          }))[0];
          this.spinner.hide();

          this.mostrarMenu(mesaEscan, pedido).then(async (rta) => {
            if (rta === 'jugar')
              ToastInfo.fire('Modalidad en proceso.'); //TODO: Pendiente
            else if (rta === 'encuesta')
              this.navCtrl.navigateRoot('alta-encuesta-cliente', { state: { idPedido: pedido.id } });
            else if (rta === 'cuenta') {
              this.push.sendNotificationToType('Pedido de cuenta',`La mesa número ${mesaEscan.nroMesa} pidió la cuenta`,'mozo');
              this.spinner.show();
              mesaEscan.estado = EstadoMesa.Pagando;
              this.db.actualizarDoc(Colecciones.Mesas, mesaEscan.id, { estado: EstadoMesa.Pagando });
              this.spinner.hide();

              pedido.porcPropina = await this.escanearPropina();
              const cuentaModal = await this.modalCtrl.create({
                component: CuentaComponent,
                id: 'cuenta-modal',
                backdropDismiss: false,
                componentProps: { pedido: pedido }
              });
              cuentaModal.present();

              const dismiss = await cuentaModal.onDidDismiss();
              if (dismiss.role === 'success') {
                this.spinner.show();
                await this.db.actualizarDoc(Colecciones.Mesas, mesaEscan.id, { estado: EstadoMesa.Pago });
                this.spinner.hide();
                ToastSuccess.fire('Pago registrado!', 'Espere a que el mozo confirme el pago.');
              }
            }
          });
          break;
      }

      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      console.error(error);
      ToastError.fire('Ups...', error.message);
    }
  }

  private async mostrarMenu(mesa: Mesa, pedido?: Pedido) {
    const modal = await this.modalCtrl.create({
      component: MenuMesaComponent,
      id: 'menu-mesa-modal',
      componentProps: { mesa: mesa, cliente: <Cliente>this.auth.UsuarioEnSesion, pedido: pedido },
    });

    await modal.present();
    const modalDismiss = await modal.onDidDismiss();

    return modalDismiss.data;
  }

  async escanearPropina() {
    const qrValidos = ['propina-0', 'propina-5', 'propina-10', 'propina-15', 'propina-20'];
    let QR: string;

    let invalido: boolean;
    do {
      invalido = false;
      QR = await this.scanner.escanear();

      if (!qrValidos.includes(QR)) {
        invalido = true;
        await MySwal.fire('El código escaneado no pertenece a una de nuestras propinas.', 'Escanee nuevamente.', 'error');
      }
    } while (invalido);

    const porcentaje = Number(QR.split('-')[1]);
    return porcentaje as PorcPropina;
  }
}
