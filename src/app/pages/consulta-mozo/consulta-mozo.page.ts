import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonItem, IonSpinner, IonIcon, IonInput } from '@ionic/angular/standalone';
import { Colecciones, DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { sendOutline } from 'ionicons/icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { Empleado } from 'src/app/utils/classes/usuarios/empleado';
import { Mesa } from 'src/app/utils/classes/mesa';

declare interface chatMsg{
  id: string,
  message : string,
  time : number,
  nombre: string
}

@Component({
  selector: 'app-consulta-mozo',
  templateUrl: './consulta-mozo.page.html',
  styleUrls: ['./consulta-mozo.page.scss'],
  standalone: true,
  imports: [IonInput, IonIcon, IonSpinner, IonItem, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CommonModule]
})
export class ConsultaMozoPage implements OnInit {

  cliente!: Cliente;
  mozo!: Empleado;
  mesa!: Mesa;
  mensajes: chatMsg[] = [
    // {id:this.auth.UsuarioEnSesion!.id ,message:'hola como estas',time:Date.now(),nombre:this.auth.UsuarioEnSesion!.nombre},
    // {id:'RNqptq22xkQ1UMgomSZm' ,message:'todo bien',time:Date.now(),nombre:'el otro'},
    // {id:this.auth.UsuarioEnSesion!.id ,message:'si y vos?',time:Date.now(),nombre:this.auth.UsuarioEnSesion!.nombre},
    // {id:'RNqptq22xkQ1UMgomSZm' ,message:'que te importa, traeme la comida',time:Date.now(),nombre:'el otro'},
    // {id:this.auth.UsuarioEnSesion!.id ,message:'ahí va pesado',time:Date.now(),nombre:this.auth.UsuarioEnSesion!.nombre},
    // {id:this.auth.UsuarioEnSesion!.id ,message:'ahí va pesado',time:Date.now(),nombre:this.auth.UsuarioEnSesion!.nombre},
    // {id:this.auth.UsuarioEnSesion!.id ,message:'ahí va pesado',time:Date.now(),nombre:this.auth.UsuarioEnSesion!.nombre},
    // {id:this.auth.UsuarioEnSesion!.id ,message:'ahí va pesado',time:Date.now(),nombre:this.auth.UsuarioEnSesion!.nombre},
    // {id:this.auth.UsuarioEnSesion!.id ,message:'ahí va pesado',time:Date.now(),nombre:this.auth.UsuarioEnSesion!.nombre},
    // {id:this.auth.UsuarioEnSesion!.id ,message:'ahí va pesado',time:Date.now(),nombre:this.auth.UsuarioEnSesion!.nombre},
  ];
  protected nuevoMensaje: string = '';
  constructor(protected db: DatabaseService, protected auth: AuthService, private spinner: NgxSpinnerService) {
    spinner.show();
    if(this.auth.UsuarioEnSesion?.rol == 'cliente'){
      this.cliente = this.auth.UsuarioEnSesion as Cliente;
      db.traerDoc<Mesa>(Colecciones.Mesas, this.cliente.idMesa!).then( mesa => {
        this.mesa = mesa;
      });
    }
    else
      this.mozo = this.auth.UsuarioEnSesion as Empleado;
    
    db.escucharColeccion<chatMsg>(Colecciones.Mensajes, this.mensajes, undefined,( (a:chatMsg, b:chatMsg) => {
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1;
      }
      return 0;
    }));
    spinner.hide();
    addIcons({ sendOutline });
  }

  ngOnInit() {
  }

  volver() {
    // this.router.navigate(['/home']);
    // this.ngOnDestroy();
  }

  enviarMensaje() {
    let msg: chatMsg = {
      id: this.auth.UsuarioEnSesion!.id,
      message: this.nuevoMensaje,
      time: Date.now(),
      nombre: this.cliente?'Mesa ' + this.mesa.nroMesa.toString():'Mozo ' + this.mozo.nombre,
    };
    if (msg.message == '') return;

    this.mensajes.push(msg);
    this.db.subirDoc(Colecciones.Mensajes,msg,true);
    this.nuevoMensaje = '';
    
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

  parsedTime(mls: number) {
    let date = new Date(mls);
    // date.getHours().toString() +
    return (
      (date.getHours() > 10 ? date.getHours().toString() : '0' + date.getHours().toString()) +
      ':' +
      (date.getMinutes() > 10 ? date.getMinutes().toString() : '0' + date.getMinutes().toString())
    );
  }
}
