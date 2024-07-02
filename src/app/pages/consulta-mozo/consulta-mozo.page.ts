import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonItem, IonSpinner, IonIcon, IonInput, IonText, IonButton } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { chevronBackCircleOutline, sendOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavController } from '@ionic/angular/standalone';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { Empleado } from 'src/app/utils/classes/usuarios/empleado';
import { Mesa } from 'src/app/utils/classes/mesa';
import { delay } from 'src/main';
import { Persona } from 'src/app/utils/classes/usuarios/persona';
import { Timestamp } from '@angular/fire/firestore';

declare interface chatMsg {
  id: string,
  mensaje: string,
  fecha: Date,
  autor: Empleado | Cliente,
  nroMesa: number | null
}
@Component({
  selector: 'app-consulta-mozo',
  templateUrl: './consulta-mozo.page.html',
  styleUrls: ['./consulta-mozo.page.scss'],
  standalone: true,
  imports: [IonButton, IonText, IonInput, IonIcon, IonSpinner, IonItem, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule]
})
export class ConsultaMozoPage implements OnInit {
  nroMesa: number | null = null;
  mensajes: chatMsg[] = [];
  /* mensajes: chatMsg[] = [
    {
      "id": "Q1DqHhgnpIOrB5WAGUEL",
      "autor": {
        "cuil": 30231233219,
        "correo": "mozo@empleado.com",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fempleado-23123321?alt=media&token=b6777f25-89ab-4d7b-bdac-a06acaf06d9e",
        "dni": 23123321,
        "tipo": "mozo",
        "rol": "empleado",
        "nombre": "Juansito",
        "apellido": "Mocito",
        "id": "RNqptq22xkQ1UMgomSZm"
      },
      "mensaje": "Buenas tardeesss",
      "fecha": new Date("2024-07-02T03:55:59.444Z"),
      "nroMesa": null
    },
    {
      "mensaje": "El próximo que pida una coca zero lo vamos a vender a alguna organización terrorista de Senegal",
      "nroMesa": null,
      "fecha": new Date("2024-07-02T03:58:16.526Z"),
      "autor": {
        "tipo": "mozo",
        "rol": "empleado",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fempleado-23123321?alt=media&token=b6777f25-89ab-4d7b-bdac-a06acaf06d9e",
        "dni": 23123321,
        "cuil": 30231233219,
        "nombre": "Juansito",
        "id": "RNqptq22xkQ1UMgomSZm",
        "correo": "mozo@empleado.com",
        "apellido": "Mocito"
      },
      "id": "MKXvqmjUZVNqJ4xFeNou"
    },
    {
      "fecha": new Date("2024-07-02T04:11:36.105Z"),
      "mensaje": "tienen manaos¿",
      "nroMesa": 1,
      "autor": {
        "id": "iFHMlgOm9QkCpJOpb651",
        "apellido": "Registrado",
        "rol": "cliente",
        "correo": "registrado@cliente.com",
        "dni": 34549760,
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-34549760?alt=media&token=19047d5b-8dad-4a42-9067-7900d79893db",
        "tipo": "registrado",
        "idMesa": "DLDy65F46o10UeAQVcyG",
        "estadoCliente": "aceptado",
        "nombre": "Cliente"
      },
      "id": "y5A8XTiKbeaLpy5GtFzg"
    },
    {
      "id": "pT3J6XYN2pH6Sxl8LSvQ",
      "mensaje": "🙊🙊🙊🙊",
      "fecha": new Date("2024-07-02T04:19:17.523Z"),
      "autor": {
        "estadoCliente": "aceptado",
        "dni": 34549760,
        "id": "iFHMlgOm9QkCpJOpb651",
        "nombre": "Cliente",
        "apellido": "Registrado",
        "correo": "registrado@cliente.com",
        "tipo": "registrado",
        "idMesa": "DLDy65F46o10UeAQVcyG",
        "rol": "cliente",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-34549760?alt=media&token=19047d5b-8dad-4a42-9067-7900d79893db"
      },
      "nroMesa": 1
    },
    {
      "id": "pT3J6XYN2pH6Sxl8LSvQ",
      "mensaje": "🙊🙊🙊🙊",
      "fecha": new Date("2024-07-02T04:20:17.523Z"),
      "autor": {
        "estadoCliente": "aceptado",
        "dni": 34549760,
        "id": "iFHMlgOm9QkCpJOpb651",
        "nombre": "Cliente",
        "apellido": "Registrado",
        "correo": "registrado@cliente.com",
        "tipo": "registrado",
        "idMesa": "DLDy65F46o10UeAQVcyG",
        "rol": "cliente",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-34549760?alt=media&token=19047d5b-8dad-4a42-9067-7900d79893db"
      },
      "nroMesa": 1
    },
    {
      "id": "pT3J6XYN2pH6Sxl8LSvQ",
      "mensaje": "🙊🙊🙊🙊",
      "fecha": new Date("2024-07-02T04:21:17.523Z"),
      "autor": {
        "estadoCliente": "aceptado",
        "dni": 34549760,
        "id": "iFHMlgOm9QkCpJOpb651",
        "nombre": "Cliente",
        "apellido": "Registrado",
        "correo": "registrado@cliente.com",
        "tipo": "registrado",
        "idMesa": "DLDy65F46o10UeAQVcyG",
        "rol": "cliente",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-34549760?alt=media&token=19047d5b-8dad-4a42-9067-7900d79893db"
      },
      "nroMesa": 1
    },
    {
      "id": "pT3J6XYN2pH6Sxl8LSvQ",
      "mensaje": "🙊🙊🙊🙊",
      "fecha": new Date("2024-07-02T04:22:17.523Z"),
      "autor": {
        "estadoCliente": "aceptado",
        "dni": 34549760,
        "id": "iFHMlgOm9QkCpJOpb651",
        "nombre": "Cliente",
        "apellido": "Registrado",
        "correo": "registrado@cliente.com",
        "tipo": "registrado",
        "idMesa": "DLDy65F46o10UeAQVcyG",
        "rol": "cliente",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-34549760?alt=media&token=19047d5b-8dad-4a42-9067-7900d79893db"
      },
      "nroMesa": 1
    },
    {
      "id": "pT3J6XYN2pH6Sxl8LSvQ",
      "mensaje": "🙊🙊🙊🙊",
      "fecha": new Date("2024-07-02T04:23:17.523Z"),
      "autor": {
        "estadoCliente": "aceptado",
        "dni": 34549760,
        "id": "iFHMlgOm9QkCpJOpb651",
        "nombre": "Cliente",
        "apellido": "Registrado",
        "correo": "registrado@cliente.com",
        "tipo": "registrado",
        "idMesa": "DLDy65F46o10UeAQVcyG",
        "rol": "cliente",
        "fotoUrl": "https://firebasestorage.googleapis.com/v0/b/pps-sp-comanda.appspot.com/o/users%2Fcliente-34549760?alt=media&token=19047d5b-8dad-4a42-9067-7900d79893db"
      },
      "nroMesa": 1
    },
  ]; */
  protected nuevoMensaje: string = '';
  protected usuario!: Empleado | Cliente;

  constructor(private db: DatabaseService, private auth: AuthService, private spinner: NgxSpinnerService, protected navCtrl: NavController) {
    addIcons({ chevronBackCircleOutline, sendOutline });
  }

  async ngOnInit() {
    this.spinner.show();
    this.usuario = this.auth.UsuarioEnSesion!.rol === 'cliente' ?
      this.auth.UsuarioEnSesion! as Cliente : this.auth.UsuarioEnSesion! as Empleado;

    if (this.usuario.rol === 'cliente') {
      this.db.traerDoc<Mesa>(Colecciones.Mesas, (<Cliente>this.usuario).idMesa!)
        .then(mesa => this.nroMesa = mesa.nroMesa);
    }

    this.db.escucharColeccion<chatMsg>(
      Colecciones.Mensajes,
      this.mensajes,
      undefined,
      (a: chatMsg, b: chatMsg) => a.fecha.getTime() - b.fecha.getTime(),
      this.timestampParse
    );

    await delay(3500);
    this.spinner.hide();
  }

  private timestampParse = async (msg: chatMsg) => {
    msg.fecha = msg.fecha instanceof Timestamp ? msg.fecha.toDate() : msg.fecha;
    return msg;
  }

  enviarMensaje() {
    const textoMensaje = this.nuevoMensaje.trim();
    if (textoMensaje == '') return;
    let msg: chatMsg = {
      id: this.usuario.id,
      mensaje: textoMensaje,
      fecha: new Date(),
      autor: this.usuario,
      nroMesa: this.nroMesa
    };
    this.nuevoMensaje = '';

    this.db.subirDoc(Colecciones.Mensajes, msg, true);

    setTimeout(() => {
      this.scrollToLastElementByClass();
    }, 10);
  }

  scrollToLastElementByClass() {
    if (this.mensajes.length > 0) {
      let elements = document.getElementsByClassName('msg');
      let lastElement: any = elements[elements.length - 1];
      let topPos = lastElement.offsetTop;
      document.getElementById('mensajes')!.scrollTop = topPos;
    }
  }
}
