import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { menuOutline, chevronDownCircle, logInOutline, logOutOutline, scan, caretDownCircle } from 'ionicons/icons';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle, IonButton, IonContent, IonFabButton, IonFab, IonIcon, IonFabList, IonModal, IonAccordionGroup, IonAccordion, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { ToastInfo, ToastSuccess } from 'src/app/utils/alerts';
import { AlertController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

declare interface Pagina { titulo: string, url: string, icono: string }
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonLabel, IonAccordion, IonAccordionGroup, IonModal, IonFabList, IonIcon, IonFab, IonFabButton, IonContent, IonButton, IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, CommonModule, NgxSpinnerModule],
})
export class MenuComponent {
  public grupos: { nombre: string, deshabilitado: boolean, paginas: Pagina[] }[] = [
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
  ];

  readonly funcIniciarSesion =
    { titulo: 'Iniciar sesión', icono: 'log-in-outline', accion: async () => this.navCtrl.navigateRoot('login') };
  readonly funcCerrarSesion =
    { titulo: 'Cerrar sesión', icono: 'log-out-outline', accion: async () => await this.cerrarSesion() };

  constructor(protected router: Router, protected navCtrl: NavController, protected auth: AuthService, private alertCtrl: AlertController, private scanner: ScannerService) {
    addIcons({ menuOutline, caretDownCircle, chevronDownCircle, logInOutline, logOutOutline, scan });

    auth.usuarioEnSesionObs.subscribe((usuario) => {
      this.grupos[1].deshabilitado = !usuario; //TODO: Agregar control por rol de usuario
      this.funciones[0] = usuario ? this.funcCerrarSesion : this.funcIniciarSesion;
    });

    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;
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
