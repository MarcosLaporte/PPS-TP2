import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle, IonButton, IonContent, IonFabButton, IonFab, IonIcon, IonFabList, IonModal, IonAccordionGroup, IonAccordion, IonLabel, IonTabButton } from '@ionic/angular/standalone';
import { menuOutline, chevronDownCircle, logInOutline, logOutOutline, scan, caretDownCircle, restaurant, chatbubblesOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { MySwal, ToastError, ToastInfo, ToastSuccess } from 'src/app/utils/alerts';
import { AlertController, NavController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Exception, ErrorCodes } from 'src/app/utils/classes/exception';
import { EstadoMesa, Mesa, parseEstadoMesa } from 'src/app/utils/classes/mesa';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { ClienteEnEspera, Roles_Tipos } from 'src/app/utils/interfaces/interfaces';
import { CheckRolTipo } from 'src/app/utils/check_rol_tipo';
import { Empleado } from 'src/app/utils/classes/usuarios/empleado';

declare interface Pagina { titulo: string, url: string, icono: string, rol_tipo?: Roles_Tipos[], permitirAnon?: boolean };
declare interface Funcion { titulo: string, icono: string, accion: () => Promise<any> };
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonTabButton, IonLabel, IonAccordion, IonAccordionGroup, IonModal, IonFabList, IonIcon, IonFab, IonFabButton, IonContent, IonButton, IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, CommonModule, NgxSpinnerModule],
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
    {
      titulo: 'Pedido', url: '/alta-pedido', icono: 'restaurant', rol_tipo: [
        { rol: 'empleado', tipo: 'mozo' },
        { rol: 'cliente' }
      ]
    },
    { titulo: 'Supervisor', url: '/alta-supervisor', icono: 'boss', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Mesa', url: '/alta-mesa', icono: 'table-picnic', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Empleado', url: '/alta-empleado', icono: 'room-service', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Encuesta', url: '/alta-encuesta-empleado', icono: 'corporate', rol_tipo: [{ rol: 'empleado' }] },
    { titulo: 'Encuesta', url: '/alta-encuestas-supervisor', icono: 'corporate', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Encuesta', url: '/alta-encuesta-cliente', icono: 'feedback-review', rol_tipo: [{ rol: 'cliente' }] },
  ];

  pagsAltas: Pagina[] = [];
  paginasGenerales: Pagina[] = [
    { titulo: 'Perfil', url: '/perfil', icono: 'circle-user' },
    { titulo: 'Inicio', url: '/home', icono: 'house-chimney', permitirAnon: true },
    { titulo: 'Clientes pendientes', url: '/lista-clientes-pendientes', icono: 'selection' },
    { titulo: 'Encuestas empleados', url: '/lista-encuestas-empleados', icono: 'corporate', rol_tipo: [{ rol: 'jefe' }] },
    { titulo: 'Lista de espera', url: '/lista-espera', icono: 'skill', rol_tipo: [{ rol: 'empleado', tipo: 'metre' }] },
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
  ) {
    addIcons({ menuOutline, caretDownCircle, chevronDownCircle, logInOutline, logOutOutline, scan, restaurant, chatbubblesOutline });

    const funcEscanear =
      { titulo: 'Escanear', icono: 'scan', accion: this.escanear };
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
      // const QR = 'entrada-yourdonistas'; //FIXME: TEST
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
            throw new Exception(ErrorCodes.TipoUsuarioIncorrecto, 'Solo los clientes pueden acceder a la lista de espera.');

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
      let url = 'lista-encuestas-clientes';
      if (res.isConfirmed) {
        if (await this.clienteEstaEnEspera(this.auth.UsuarioEnSesion!.id))
          throw new Exception(ErrorCodes.ClienteEnEspera, 'Ya se encuentra en la lista de espera!');

        const clienteEnEspera: ClienteEnEspera = { id: '', fecha: new Date(), cliente: this.auth.UsuarioEnSesion as Cliente };
        this.db.subirDoc(Colecciones.ListaDeEspera, clienteEnEspera, true);
        url = 'clientes-espera';
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
      const cliente = this.auth.UsuarioEnSesion as Cliente;
      if (idMesa !== cliente.idMesa)
        throw new Exception(ErrorCodes.MesaEquivocada, "Esta no es su mesa.");

      this.spinner.show();
      const mesa = await this.db.traerDoc<Mesa>(Colecciones.Mesas, idMesa);

      if (mesa && cliente) {

        switch (mesa.estado) {
          case EstadoMesa.Disponible:
            ToastInfo.fire('Para acceder a esta mesa, se le debe ser asignada por el metre.');
            break;
          case EstadoMesa.Asignada:
            this.spinner.hide();
            await MySwal.fire({
              title: `Bienvenido, ${cliente.nombre}`,
              text: '¿Ya desea realizar su pedido?',
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: true,
              confirmButtonText: 'Sí',
              confirmButtonColor: '#a5dc86',
              showDenyButton: true,
              denyButtonText: 'No',
              denyButtonColor: '#f27474',
            }).then(async (res) => {
              this.spinner.show();
              if (res.isConfirmed) {
                mesa.estado = EstadoMesa.PidiendoComida;
                this.db.actualizarDoc(Colecciones.Mesas, mesa.id, { estado: EstadoMesa.PidiendoComida });
                this.navCtrl.navigateRoot('alta-pedido');
              } else {
                mesa.estado = EstadoMesa.SinPedido;
                this.db.actualizarDoc(Colecciones.Mesas, mesa.id, { estado: EstadoMesa.SinPedido });
              }
            });
            break;
          case EstadoMesa.SinPedido:
            this.spinner.hide();
            await MySwal.fire({
              title: `Bienvenido ${cliente.nombre}`,
              text: '¿Qué desea hacer?',
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: true,
              confirmButtonText: 'Pedir comida',
              showDenyButton: true,
              denyButtonText: 'Consultar',
              showCancelButton: true,
              cancelButtonText: 'nada',
              cancelButtonColor: '#f27474',
            }).then(async (res) => {
              if (res.isConfirmed) {
                this.navCtrl.navigateRoot('alta-pedido');
              } else if (res.isDenied) {
                //ir a consultas
              }
            });
            break;
          /*
          case EstadoMesa.PidiendoComida:
          break;
          */
          case EstadoMesa.EsperandoComida:

            break;
          case EstadoMesa.Comiendo:

            break;
          case EstadoMesa.Pagando:
            break;
        }
      }

      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ups...', error.message);
    }

  }
}
