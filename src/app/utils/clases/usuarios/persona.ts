export abstract class Persona {
  id: string;
  rol: RolUsuario;
  nombre: string;
  apellido: string;
  dni: number;
  correo: string;
  fotoUrl: string;

  constructor(id: string, rol: RolUsuario, nombre: string, apellido: string, dni: number, correo: string, fotoUrl: string) {
    this.id = id;
    this.rol = rol;
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.correo = correo;
    this.fotoUrl = fotoUrl;
  }
}

export type RolUsuario = 'cliente' | 'empleado' | 'jefe';