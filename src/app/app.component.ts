import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle } from '@ionic/angular/standalone';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './services/auth.service';
import { chevronDownCircle, logInOutline, logOutOutline, menuOutline, scan } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavController, AlertController } from '@ionic/angular';
import { ScannerService } from './services/scanner.service';
import { ToastInfo, ToastSuccess, ToastError, MySwal } from './utils/alerts';
import { Colecciones, DatabaseService } from './services/database.service';
import { Mesa } from './utils/classes/mesa';
import { Cliente } from './utils/classes/usuarios/cliente';
import { ErrorCodes, Exception } from './utils/classes/exception';
import { MenuComponent } from './components/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, NgxSpinnerModule, MenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  constructor(protected router: Router, protected navCtrl: NavController, protected auth: AuthService, protected scanner: ScannerService) {
    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;

    // navCtrl.navigateRoot('splash');
    navCtrl.navigateRoot('alta-mesa');

    addIcons({ scan });
  }
}
