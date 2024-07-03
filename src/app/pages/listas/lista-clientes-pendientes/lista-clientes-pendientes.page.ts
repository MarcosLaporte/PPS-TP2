import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonIcon, IonAvatar, IonList } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay } from 'src/main';
import { ToastSuccess } from 'src/app/utils/alerts';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-lista-clientes-pendientes',
  templateUrl: './lista-clientes-pendientes.page.html',
  styleUrls: ['./lista-clientes-pendientes.page.scss'],
  standalone: true,
  imports: [IonList, IonAvatar, IonIcon, IonButton, IonLabel, IonItem, IonAccordion, IonAccordionGroup, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ListaClientesPendientesPage implements OnInit {

  protected clientes: Cliente[] = [];
  //FIXME: TEST
  /* protected clientes: Cliente[] =
  [
    {
        "apellido": "Carlos",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-23628819?alt=media&token=1fcafef1-fc52-4d20-8d56-59672837d5d1",
        "dni": 23628819,
        "estadoCliente": "pendiente",
        "correo": "robertoCarlos@gmail.com",
        "rol": "cliente",
        "nombre": "Roberto",
        "idMesa": null,
        "tipo": "registrado",
        "id": "OKKwvWKGkDC9CsjCcIUK"
    },
    {
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-32453888?alt=media&token=b8454705-af17-41ca-aacd-9510b9060a34",
        "nombre": "Pepito",
        "estadoCliente": "pendiente",
        "id": "VuIUEXELrX4AZsLs6F8X",
        "rol": "cliente",
        "apellido": "Lopez",
        "idMesa": null,
        "correo": "elpepe@outlook.com",
        "tipo": "registrado",
        "dni": 32453888
    }
  ];
 */
  constructor(protected db: DatabaseService, private spinner: NgxSpinnerService, private email: EmailService, protected navCtrl: NavController) {
    addIcons({ checkmarkCircleOutline, removeCircleOutline });
  }

  async ngOnInit() {
    this.spinner.show();
    this.db.escucharColeccion<Cliente>(
      Colecciones.Usuarios,
      this.clientes,
      (c) => c.estadoCliente === 'pendiente'
    );

    await delay(2500);
    this.spinner.hide();
  }

  async manejarCliente(cliente: Cliente, estado: 'aceptado' | 'rechazado') {
    this.spinner.show();
    await this.db.actualizarDoc(Colecciones.Usuarios, cliente.id, { 'estadoCliente': estado });
    ToastSuccess.fire(`Cliente ${estado}!`);

    this.email.mandarCorreoAutomatico(estado == 'aceptado', cliente.nombre, cliente.correo)

    this.spinner.hide();
  }
}
