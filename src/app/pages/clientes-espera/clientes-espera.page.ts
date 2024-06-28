import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { NavController } from '@ionic/angular';
import { ToastSuccess } from 'src/app/utils/alerts';
import { Mesa } from 'src/app/utils/classes/mesa';
import { ClienteEnEspera } from 'src/app/utils/interfaces/interfaces';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-clientes-espera',
  templateUrl: './clientes-espera.page.html',
  styleUrls: ['./clientes-espera.page.scss'],
  standalone: true,
  imports: [IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ClientesEsperaPage implements OnInit {

  constructor(private db: DatabaseService, private auth: AuthService, private navCtrl: NavController, private spinner: NgxSpinnerService) { }

  async ngOnInit() {
    //Escucha cuando se le asigna idMesa al cliente
    const docObs = this.db.escucharDocumento<Cliente>
      (Colecciones.Usuarios, this.auth.UsuarioEnSesion!.id).subscribe(
        async (cliente) => {
          if (!cliente.idMesa) return;

          this.spinner.show();
          const mesa = await this.db.traerDoc<Mesa>(Colecciones.Mesas, cliente.idMesa);

          ToastSuccess.fire(`Se le ha asignado la mesa N°${mesa.nroMesa}.`);
          this.spinner.hide();

          this.navCtrl.navigateRoot('home');
          docObs.unsubscribe();
        });
  }

}
