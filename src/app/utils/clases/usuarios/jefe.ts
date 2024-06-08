import { Persona } from "./persona";

export class Jefe extends Persona {
  perfil: TipoJefe;
  cuil: number;

  constructor(id: string, nombre: string, apellido: string, dni: number, cuil: number, fotoUrl: string, perfil: TipoJefe) {
    super(id, 'jefe', nombre, apellido, dni, fotoUrl);
    this.perfil = perfil;
    this.cuil = cuil;
  }

}
export type TipoJefe = 'dueño' | 'supervisor';
