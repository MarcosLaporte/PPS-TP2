import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle } from '@ionic/angular/standalone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from './services/auth.service';
import { skullSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, CommonModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  public paginas = [
    { titulo: 'Mesas', url: '/mesas', icono: 'skull' },
    { titulo: 'Productos', url: '/productos', icono: 'skull' },
    { titulo: 'Clientes', url: '/clientes', icono: 'skull' },
    { titulo: 'Encuestas', url: '/encuestas', icono: 'skull' },
  ];

  constructor(protected router: Router, protected auth: AuthService) {
    const ssUser = sessionStorage.getItem('usuario');
    this.auth.UsuarioEnSesion = ssUser ? JSON.parse(ssUser) : null;

    router.navigateByUrl('splash');

    addIcons({ skullSharp });

  }
}
