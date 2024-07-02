export abstract class Persona {
  id: string;
  rol: RolUsuario;
  nombre: string;
  apellido: string;
  dni: number;
  fotoUrl: string;
  correo: string;

  constructor(rol: RolUsuario, nombre: string, apellido: string, dni: number, fotoUrl: string, correo: string) {
    this.id = '';
    this.rol = rol;
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.fotoUrl = fotoUrl;
    this.correo = correo;
  }
}

export type RolUsuario = 'cliente' | 'empleado' | 'jefe';
