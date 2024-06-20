import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle } from '@ionic/angular/standalone';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './services/auth.service';
import { chevronDownCircle, logInOutline, logOutOutline, menuOutline, scan } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AlertController, NavController } from '@ionic/angular';
import { ScannerService } from './services/scanner.service';
import { ToastInfo, ToastSuccess, ToastError, MySwal } from './utils/alerts';
import { Colecciones, DatabaseService } from './services/database.service';
import { Mesa } from './utils/classes/mesa';
import { Cliente } from './utils/classes/usuarios/cliente';

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

    // // navCtrl.navigateRoot('splash');
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
    { titulo: 'Escanear', icono: 'scan', accion: async () => await this.escanearQrMesa() },
  ]
  readonly funcIniciarSesion =
    { titulo: 'Iniciar sesión', icono: 'log-in-outline', accion: async () => this.navCtrl.navigateRoot('login') };
  readonly funcCerrarSesion =
    { titulo: 'Cerrar sesión', icono: 'log-out-outline', accion: async () => await this.cerrarSesion() };
  constructor(protected router: Router, protected navCtrl: NavController, protected auth: AuthService, private alertCtrl: AlertController, private scanner: ScannerService, private db: DatabaseService, private spinner: NgxSpinnerService) {
    auth.usuarioEnSesionObs.subscribe((usuario) => {
      this.grupos[1].deshabilitado = !usuario; //TODO: Agregar control por rol de usuario
      this.funciones[0] = usuario ? this.funcCerrarSesion : this.funcIniciarSesion;
    });

    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;

    navCtrl.navigateRoot('home');
    // navCtrl.navigateRoot('splash');

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

  async escanearQrMesa(){
    // const QR : string = await this.scanner.escanear();
    const QR : string = "id:DLDy65F46o10UeAQVcyG" //esto es simulado
    // const valorCrudo = await this.scanner.escanear([BarcodeFormat.Pdf417]);
    try {
      this.spinner.show();

      const mesa = await this.db.traerDoc<Mesa>(Colecciones.Mesas, QR.split(':')[1]);
      // const cliente = await this.db.traerDoc<Cliente>(Colecciones.Usuarios, this.auth.UsuarioEnSesion!.id);
      const cliente = await this.db.traerDoc<Cliente>(Colecciones.Usuarios, 'PxxHa5NQnLBf74kho38W');

      let TEST = true;
      
      if(mesa && cliente){

        switch(mesa.estado){
          case 'disponible':
            this.spinner.hide();
            if(cliente.idMesa == mesa.id || TEST){
              await MySwal.fire({
                title: `Bienvenido ${cliente.nombre}`,
                text: 'Ya desea realizar su pedido?',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: true,
                confirmButtonText: 'Sí',
                confirmButtonColor: '#a5dc86',
                showDenyButton: true,
                denyButtonText: 'No',
                denyButtonColor: '#f27474',
              }).then(async (res) => {
                if(res.isConfirmed){
                  this.db.actualizarDoc(Colecciones.Mesas, mesa.id, {'estado':'cliente pidiendo comida'});
                  this.pedirComida(mesa);
                }else{
                  this.db.actualizarDoc(Colecciones.Mesas, mesa.id, {'estado':'cliente sin comida'});
                }
              });
            }else{
              ToastError.fire(`Esta no es su mesa`);  
            }
          break;

          case 'cliente sin pedido':
            this.pedirComida(mesa);
            console.log('sin pedido');
          break;

          case 'cliente pidiendo comida':
            this.pedirComida(mesa);
            console.log('cliente pidiendo comid');
          break;

          case 'cliente esperando comida':
            this.pedirComida(mesa);
            console.log('cliente esperando comida');
          break;

          case 'cliente comiendo':
            console.log('cliente comiendo');
          break;

          case 'cliente pagando':
          console.log('cliente pagando');
          break;
        }
      }

      this.spinner.hide();
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ups...', error.message);
    }
    
  }
  pedirComida(mesa: Mesa){
    //menu con funciones de pedir comida
    this.db.actualizarDoc(Colecciones.Mesas, mesa.id, {'estado':'cliente esperando comida'});
  }
}
