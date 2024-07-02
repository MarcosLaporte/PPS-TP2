import { Persona } from './persona';

export class Jefe extends Persona {
  perfil: TipoJefe;
  cuil: number;

  constructor(nombre: string, apellido: string, dni: number, cuil: number, correo: string, fotoUrl: string, perfil: TipoJefe) {
    super('jefe', nombre, apellido, dni, fotoUrl, correo);
    this.perfil = perfil;
    this.cuil = cuil;
  }
}
export type TipoJefe = 'dueño' | 'supervisor';
