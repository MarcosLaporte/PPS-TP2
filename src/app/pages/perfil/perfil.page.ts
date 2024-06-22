import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Persona } from 'src/app/utils/classes/usuarios/persona';
import { Cliente } from 'src/app/utils/classes/usuarios/cliente';
import { Empleado } from 'src/app/utils/classes/usuarios/empleado';
import { Jefe } from 'src/app/utils/classes/usuarios/jefe';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PerfilPage {
  readonly usuario: Persona;

  constructor(private auth: AuthService) {
    this.usuario = auth.UsuarioEnSesion!;
  }

  usuarioRol = () => {
    const rolesMap = {
      cliente: (this.usuario as Cliente).tipo,
      empleado: (this.usuario as Empleado).tipo,
      jefe: (this.usuario as Jefe).perfil
    };

    const tipo = rolesMap[this.usuario.rol];

    return `${this.usuario.rol} - ${tipo}`;
  }
}
