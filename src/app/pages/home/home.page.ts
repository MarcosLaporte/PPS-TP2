import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonText, IonCard, IonButton, IonList, IonCardTitle, IonCardHeader, IonCardContent, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline, qrCodeOutline, restaurantOutline } from 'ionicons/icons';
import { ScannerService } from 'src/app/services/scanner.service';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonButton, IonCard, IonText, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule]
})
export class HomePage {
  paginas = [
    'alta-cliente',
    'alta-producto',
    'alta-supervisor',
    'alta-mesa',
    'alta-empleado'
  ];

  constructor(public scanner: ScannerService, protected nav: NavController) {
    addIcons({ qrCodeOutline, peopleOutline, restaurantOutline });
  }

}
