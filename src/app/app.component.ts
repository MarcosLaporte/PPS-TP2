import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle } from '@ionic/angular/standalone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from './services/auth.service';
import { NavController } from '@ionic/angular/standalone';
import { MenuComponent } from './components/menu/menu.component';
import { Colecciones, DatabaseService } from './services/database.service';
import { Persona } from './utils/classes/usuarios/persona';
import { Subscription } from 'rxjs';

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
  constructor(protected navCtrl: NavController, protected auth: AuthService, private db: DatabaseService) {
    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;

    auth.sesionEventEmitter.subscribe((ev) => {
      const sesion = ev.sesionAbierta;
      if (sesion) {
        this.usuarioDocSub = this.db.escucharDocumento<Persona>(Colecciones.Usuarios, this.auth.UsuarioEnSesion!.id)
          .subscribe((user) => {
            this.auth.UsuarioEnSesion = user;
          });
      } else {
        navCtrl.navigateRoot('login');
        this.usuarioDocSub?.unsubscribe();
      }
    });

    if (ssUser) auth.sesionEventEmitter.emit({ sesionAbierta: true });
  }

  ngOnDestroy(): void {
    this.usuarioDocSub?.unsubscribe();
  }
}