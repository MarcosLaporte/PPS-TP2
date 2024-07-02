import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonLabel, IonItem, IonRadio, IonButton, IonCardContent } from '@ionic/angular/standalone';
import { RangeEstrellasComponent } from 'src/app/components/range-estrellas/range-estrellas.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-alta-encuesta-supervisor',
  templateUrl: './alta-encuesta-supervisor.page.html',
  styleUrls: ['./alta-encuesta-supervisor.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonButton, IonRadio, IonItem, IonLabel, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RangeEstrellasComponent]
})
export class AltaEncuestaSupervisorPage implements OnInit {

  // frmEncuesta: FormGroup;
  
  constructor(
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private db: DatabaseService,
    private storage: StorageService,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    // this.frmEncuesta = this.formBuilder.group({
    //   puntuacionGeneral: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    //   comida: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    //   atencion: ['buena', [Validators.required]],
    //   recomendacion: [false, [Validators.required]],
    //   comentarios: ['', [Validators.required]],
    // });
  }

}
