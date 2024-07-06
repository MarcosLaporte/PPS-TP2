import { ChangeDetectorRef, Component, DoCheck, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
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
import { PushService } from 'src/app/services/push.service';

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
export class ConsultaMozoPage implements OnInit, DoCheck {
  nroMesa: number | null = null;
  mensajes: chatMsg[] = [];
  protected nuevoMensaje: string = '';
  protected usuario!: Empleado | Cliente;
  private cantMsjPrev: number = 0;

  constructor(private db: DatabaseService, private auth: AuthService, private spinner: NgxSpinnerService, protected navCtrl: NavController, private push: PushService, private cdr: ChangeDetectorRef) {
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
    this.cantMsjPrev = this.mensajes.length;
    this.spinner.hide();
  }

  private timestampParse = async (msg: chatMsg) => {
    msg.fecha = msg.fecha instanceof Timestamp ? msg.fecha.toDate() : msg.fecha;
    return msg;
  }

  @ViewChild('mensajesDiv') mensajesDiv!: ElementRef;
  trackByFn(index: number, item: any) {
    return item.id;
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

    if (this.usuario.rol === 'cliente') {
      this.push.sendNotificationToType('Nueva consulta', `La mesa ${msg.nroMesa} dijo: ${msg.mensaje}`, 'mozo');
    }

    this.db.subirDoc(Colecciones.Mensajes, msg, true);
  }

  ngDoCheck() {
    if (this.mensajes.length !== this.cantMsjPrev) {
      console.log('Array de mensajes ha cambiado');
      this.cantMsjPrev = this.mensajes.length;
      this.scrollUltimoMensaje();
    }
  }

  scrollUltimoMensaje() {
    try {
      setTimeout(() => {
        this.mensajesDiv.nativeElement.scrollTop = this.mensajesDiv.nativeElement.scrollHeight;
      }, 100);
    } catch (err) {
      console.error('Error al desplazar al fondo', err);
    }
  }
}
