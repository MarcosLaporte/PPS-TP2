import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonText, IonCard, IonButton, IonList, IonCardTitle, IonCardHeader, IonCardContent, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { peopleOutline, qrCodeOutline, restaurantOutline } from 'ionicons/icons';
import { ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonButton, IonCard, IonText, IonItem, IonContent, IonHeader, IonTitle, IonToolbar]
})
export class HomePage {

  constructor(public scanner: ScannerService) {
    addIcons({ qrCodeOutline, peopleOutline, restaurantOutline });
  }

}
