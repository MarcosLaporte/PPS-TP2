import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle, IonButton, IonContent, IonFabButton, IonFab, IonIcon, IonFabList, IonModal, IonAccordionGroup, IonAccordion, IonLabel, IonTabButton } from '@ionic/angular/standalone';
import { menuOutline, chevronDownCircle, logInOutline, logOutOutline, scan, caretDownCircle, restaurant } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { MySwal, ToastError, ToastInfo, ToastSuccess } from 'src/app/utils/alerts';
import { AlertController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Exception, ErrorCodes } from 'src/app/utils/classes/exception';
import { EstadoMesa, Mesa, parseEstadoMesa } from 'src/app/utils/classes/mesa';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { Roles_Tipos } from 'src/app/utils/interfaces/interfaces';
import { CheckRolTipo } from 'src/app/utils/check_rol_tipo';

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
  ];

  pagsAltas: Pagina[] = [];
  paginasGenerales: Pagina[] = [
    { titulo: 'Perfil', url: '/perfil', icono: 'circle-user' },
    { titulo: 'Inicio', url: '/home', icono: 'house-chimney', permitirAnon: true },
    { titulo: 'Encuestas empleados', url: '/alta-encuestas-empleados', icono: 'corporate', rol_tipo: [{ rol: 'empleado' }] },
    { titulo: 'Encuestas empleados', url: '/lista-encuestas-empleados', icono: 'corporate', rol_tipo: [{ rol: 'jefe' }] },
    {
      titulo: 'Encuestas clientes', url: '/alta-encuesta-cliente', icono: 'corporate', permitirAnon: true, rol_tipo: [
        { rol: 'cliente' }, { rol: 'jefe' }
      ]
    },
    {
      titulo: 'Graficos Clientes', url: '/grafico-clientes', icono: 'bar-chart-outline', rol_tipo: [
        { rol: 'cliente' }, { rol: 'jefe' }
      ]
    },
  ];
  funciones: Funcion[] = [];

  constructor(protected router: Router, protected navCtrl: NavController, protected auth: AuthService, private alertCtrl: AlertController, private scanner: ScannerService, private db: DatabaseService, private spinner: NgxSpinnerService) {
    addIcons({ menuOutline, caretDownCircle, chevronDownCircle, logInOutline, logOutOutline, scan, restaurant });

    const funcEscanear =
      { titulo: 'Escanear', icono: 'scan', accion: async () => await this.escanear() };
    const funcIniciarSesion =
      { titulo: 'Iniciar sesión', icono: 'log-in-outline', accion: async () => this.navCtrl.navigateRoot('login') };
    const funcCerrarSesion =
      { titulo: 'Cerrar sesión', icono: 'log-out-outline', accion: async () => await this.cerrarSesion() };

    auth.usuarioEnSesionObs.subscribe((usuario) => {
      this.pagsAltas = this.altas.filter((pag) => CheckRolTipo(auth, pag.rol_tipo, pag.permitirAnon));

      if (!usuario) {
        this.funciones[0] = funcIniciarSesion;
        this.funciones.splice(1, 1);
      } else {
        this.funciones[0] = funcCerrarSesion;
        this.funciones[1] = funcEscanear;
      }
    });

    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;
  }

  itemClick(url: string) {
    const accordion = document.getElementById('lista-global') as HTMLIonAccordionGroupElement;
    accordion.value = [];
    this.navCtrl.navigateRoot(url)
  }
  saberUsuario() {

    console.log(this.auth.currentUser())
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
          ,
        },
        {
          text: 'Sí',
          role: 'confirm',
          handler: async () => {
            this.auth.signOut();
            ToastSuccess.fire('Sesión cerrada!');
            this.navCtrl.navigateRoot('login');
          },
        }
      ],
    });

    await alert.present();
  }

  async escanear() {
    // const QR: string = await this.scanner.escanear();
    const QR = 'entrada-yourdonistas';
    const qrSeparado = QR.split('-');

    switch (qrSeparado[0]) {
      case 'entrada': //Código de entrada
        this.accederListaDeEspera();
        break;
      case 'mesa':
        this.escanearQrMesa(qrSeparado[1]);
        break;
      default:
        ToastError.fire('El código escaneado no es reconocido.');
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
    }).then((res) => {
      let url = 'lista-encuestas-clientes';
      if (res.isConfirmed) {
        this.db.subirDoc(Colecciones.ListaDeEspera, this.auth.UsuarioEnSesion as Cliente, false);
        url = 'cliente-espera';
      }

      this.navCtrl.navigateRoot(url);
    });
  }

  async escanearQrMesa(idMesa: string) {
    try {
      this.spinner.show();
      const mesa = await this.db.traerDoc<Mesa>(Colecciones.Mesas, idMesa);
      const cliente = this.auth.UsuarioEnSesion as Cliente;

      if (mesa && cliente) {
        console.log(parseEstadoMesa(mesa.estado));
        switch (mesa.estado) {
          case EstadoMesa.Disponible:
            this.spinner.hide();
            if (cliente.idMesa === mesa.id) {
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
                if (res.isConfirmed) {
                  mesa.estado = EstadoMesa.PidiendoComida;
                  this.db.actualizarDoc(Colecciones.Mesas, mesa.id, { estado: EstadoMesa.PidiendoComida });
                  this.pedirComida(mesa);
                } else {
                  mesa.estado = EstadoMesa.SinPedido;
                  this.db.actualizarDoc(Colecciones.Mesas, mesa.id, { estado: EstadoMesa.SinPedido });
                }
              });
            } else {
              throw new Exception(ErrorCodes.MesaEquivocada, "Esta no es su mesa.");
            }
            break;
          case EstadoMesa.SinPedido:
            this.pedirComida(mesa);
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
  pedirComida(mesa: Mesa) {
    //menu con funciones de pedir comida
    this.db.actualizarDoc(Colecciones.Mesas, mesa.id, { estado: EstadoMesa.EsperandoComida });
  }
}
