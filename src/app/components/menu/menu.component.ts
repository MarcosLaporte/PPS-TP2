import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { menuOutline, chevronDownCircle, logInOutline, logOutOutline, scan, caretDownCircle } from 'ionicons/icons';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle, IonButton, IonContent, IonFabButton, IonFab, IonIcon, IonFabList, IonModal, IonAccordionGroup, IonAccordion, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { ScannerService } from 'src/app/services/scanner.service';
import { MySwal, ToastError, ToastInfo, ToastSuccess } from 'src/app/utils/alerts';
import { AlertController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Exception, ErrorCodes } from 'src/app/utils/classes/exception';
import { Mesa } from 'src/app/utils/classes/mesa';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';

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
    { titulo: 'Escanear', icono: 'scan', accion: async () => await this.escanearQrMesa() },
  ];

  readonly funcIniciarSesion =
    { titulo: 'Iniciar sesión', icono: 'log-in-outline', accion: async () => this.navCtrl.navigateRoot('login') };
  readonly funcCerrarSesion =
    { titulo: 'Cerrar sesión', icono: 'log-out-outline', accion: async () => await this.cerrarSesion() };

  constructor(protected router: Router, protected navCtrl: NavController, protected auth: AuthService, private alertCtrl: AlertController, private scanner: ScannerService,  private db: DatabaseService, private spinner: NgxSpinnerService) {
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

  async escanearQrMesa(){
    // const QR : string = await this.scanner.escanear();
    const QR : string = "DLDy65F46o10UeAQVcyG" //esto es simulado
    // const valorCrudo = await this.scanner.escanear([BarcodeFormat.Pdf417]);
    try {
      this.spinner.show();
      const mesa = await this.db.traerDoc<Mesa>(Colecciones.Mesas, QR);
      const cliente = this.auth.UsuarioEnSesion as Cliente;
      console.log(mesa);
      console.log(cliente);

      // let TEST = true;
      
      if(mesa && cliente){

        switch(mesa.estado){
          case 'disponible':
            this.spinner.hide();
              if(cliente.idMesa == mesa.id){
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
                  this.db.actualizarDoc(Colecciones.Mesas, mesa.id, {'estado':'cliente sin pedido'});
                }
              });
            }else{
              throw new Exception(ErrorCodes.MesaEquivocada,"esta no es tu mesa");
            }
          break;

          case 'cliente sin pedido':
            this.pedirComida(mesa);
            console.log('cliente sin pedido');
          break;
          /*
          case 'cliente pidiendo comida':
            console.log('cliente pidiendo comid');
          break;
          */
          case 'cliente esperando comida':
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
