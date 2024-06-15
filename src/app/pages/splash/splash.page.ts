import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, CommonModule, FormsModule]
})
export class SplashPage implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    const url = this.auth.UsuarioEnSesion ? 'home' : 'login';
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 5500);
  }

}
