import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonItem, IonTitle } from '@ionic/angular/standalone';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonTitle, IonItem, IonToolbar, IonHeader, IonApp, IonRouterOutlet, CommonModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  constructor(protected router: Router) {
    // router.navigateByUrl('splash');
    router.navigateByUrl('alta-supervisor');
  }
}
