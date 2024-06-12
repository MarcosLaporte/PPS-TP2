import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonText } from '@ionic/angular/standalone';
import { AltaEmpleadoComponent } from 'src/app/components/alta-empleado/alta-empleado.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonText, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, AltaEmpleadoComponent]
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log();
    
  }

}
