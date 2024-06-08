export abstract class Persona {
  id: string;
  rol: RolUsuario;
  nombre: string;
  apellido: string;
  dni: number;
  fotoUrl: string;

  constructor(id: string, rol: RolUsuario, nombre: string, apellido: string, dni: number, fotoUrl: string) {
    this.id = id;
    this.rol = rol;
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.fotoUrl = fotoUrl;
  }
}

export type RolUsuario = 'cliente' | 'empleado' | 'jefe';