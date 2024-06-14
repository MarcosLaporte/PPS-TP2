import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonInput, IonInputPasswordToggle, IonFabButton, IonFabList, IonIcon, IonCard, IonCardContent, IonButton, IonItem, IonText, IonRow, IonCol } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastError, ToastInfo, ToastQuestion, ToastSuccess, ToastWarning } from 'src/app/utils/alerts';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonText, IonItem, IonButton, IonInput, IonInputPasswordToggle, IonCardContent, IonCard, IonIcon, IonFabList, IonFabButton, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, protected navCtrl: NavController, private auth: AuthService, private spinner: NgxSpinnerService) {
    this.form = fb.group({
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]
      ],
      contra: [
        '',
        [
          Validators.required,
        ]
      ]
    });

  }

  async ngOnInit() {
    console.log();
  }

  async ingresar() {
    this.spinner.show();
    try {
      const correoContr = this.form.controls['correo'];
      const contraContr = this.form.controls['contra'];
      await this.auth.ingresarFireAuth(correoContr.value, contraContr.value);

      correoContr.setValue("");
      contraContr.setValue("");
      ToastSuccess.fire('Operación realizada con éxito.');

      this.navCtrl.navigateRoot('home');
    } catch (error: any) {
      this.spinner.hide();
      ToastError.fire('Ups! Algo salió mal.', error.message);
    } finally {
      this.spinner.hide();
    }
  }

  accesoRapido(correo: string) {
    this.form.controls['correo'].setValue(correo);
    this.form.controls['contra'].setValue('UTNFRA');
  }
}
