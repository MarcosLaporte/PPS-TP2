import { FcmService } from './services/fcm.service';

import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle } from '@ionic/angular/standalone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from './services/auth.service';
import { NavController } from '@ionic/angular/standalone';
import { MenuComponent } from './components/menu/menu.component';
import { Colecciones, DatabaseService } from './services/database.service';
import { Persona } from './utils/classes/usuarios/persona';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, NgxSpinnerModule, MenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppComponent implements OnDestroy {
  private usuarioDocSub?: Subscription;
  constructor(protected navCtrl: NavController, protected auth: AuthService,
    private db: DatabaseService,private fcm: FcmService,private platform: Platform,
  ) {
    const ssUser = sessionStorage.getItem('usuario');
    console.log('*** ssUser:', ssUser);

    console.log('*** idUser:',this.auth.auth.currentUser?.uid);

    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;
    console.log('*** UsuarioEnSesion:', this.auth.UsuarioEnSesion);

    auth.sesionEventEmitter.subscribe((ev) => {
      const sesion = ev.sesionAbierta;
      if (sesion) {


        this.usuarioDocSub = this.db.escucharDocumento<Persona>(Colecciones.Usuarios, this.auth.UsuarioEnSesion!.id)
          .subscribe((user) => {
            this.auth.UsuarioEnSesion = user;
          });


          if(this.auth.UsuarioEnSesion){

            this.platform.ready().then(() => {
              console.log('*** Platform is ready, calling initPush');
              console.log("correo usuario",this.auth.UsuarioEnSesion!.correo)
              console.log("nombre usuario",this.auth.UsuarioEnSesion!.nombre)
              console.log("idusuario",this.auth.UsuarioEnSesion!.id)

              this.fcm.initPush(this.auth.UsuarioEnSesion!.id);
            }).catch(e => {
              console.log('*** Error in platform.ready:', e);
            });

          }
      } else {
        navCtrl.navigateRoot('login');
        this.usuarioDocSub?.unsubscribe();
      }
    });

    if (ssUser) auth.sesionEventEmitter.emit({ sesionAbierta: true });
    navCtrl.navigateRoot('home') //TODO: Splash
  }

  ngOnDestroy(): void {
    this.usuarioDocSub?.unsubscribe();
  }


}

