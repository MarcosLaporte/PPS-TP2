import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonText, IonItem, IonContent, IonHeader, IonTitle, IonToolbar]
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log();
    
  }

}
