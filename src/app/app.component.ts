import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle } from '@ionic/angular/standalone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from './services/auth.service';
import { chevronDownCircle, logInOutline, logOutOutline, menuOutline, scan } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AlertController, NavController } from '@ionic/angular';
import { ScannerService } from './services/scanner.service';
import { ToastInfo, ToastSuccess } from './utils/alerts';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, CommonModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  // constructor(protected router: Router, protected navCtrl: NavController, protected auth: AuthService, protected scanner: ScannerService) {
  //   const ssUser = sessionStorage.getItem('usuario');
  //   this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;

  //   // navCtrl.navigateRoot('splash');
  //   navCtrl.navigateRoot('alta-mesa');

  //   addIcons({ scan });
  // }
  public grupos = [
    {
      nombre: 'General',
      deshabilitado: false,
      paginas: [{ titulo: 'Inicio', url: '/home', icono: 'house-chimney' }]
    },
    {
      nombre: 'Altas',
      deshabilitado: true,
      paginas: [
        { titulo: 'Mesa', url: '/alta-mesa', icono: 'table-picnic' },
        { titulo: 'Empleado', url: '/alta-empleado', icono: 'room-service' },
        { titulo: 'Cliente', url: '/alta-cliente', icono: 'review' },
        { titulo: 'Producto', url: '/alta-producto', icono: 'utensils' },
        { titulo: 'Supervisor', url: '/alta-supervisor', icono: 'boss' },
      ]
    }
  ];

  public funciones: { titulo: string, icono: string, accion: () => Promise<any> }[] = [
    { titulo: 'Sesión', icono: 'log-in-outline', accion: async () => { } },
    { titulo: 'Escanear', icono: 'scan', accion: async () => await this.scanner.escanear() },
  ]

  readonly funcIniciarSesion =
    { titulo: 'Iniciar sesión', icono: 'log-in-outline', accion: async () => this.navCtrl.navigateRoot('login') };
  readonly funcCerrarSesion =
    { titulo: 'Cerrar sesión', icono: 'log-out-outline', accion: async () => await this.cerrarSesion() };
  constructor(protected router: Router, protected navCtrl: NavController, protected auth: AuthService, private alertCtrl: AlertController, private scanner: ScannerService) {
    auth.usuarioEnSesionObs.subscribe((usuario) => {
      this.grupos[1].deshabilitado = !usuario; //TODO: Agregar control por rol de usuario
      this.funciones[0] = usuario ? this.funcCerrarSesion : this.funcIniciarSesion;
    });

    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;

    navCtrl.navigateRoot('home');

    addIcons({ menuOutline, chevronDownCircle, logInOutline, logOutOutline, scan });
  }

  itemClick(url: string) {
    const modal = document.getElementById('pagsModal') as HTMLIonModalElement;
    modal.dismiss();
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
          ,
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
}
