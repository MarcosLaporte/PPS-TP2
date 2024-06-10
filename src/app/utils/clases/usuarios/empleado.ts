import { Persona } from "./persona"

export class Empleado extends Persona {
  tipo: TipoEmpleado;
  cuil: number;

  constructor(id: string, nombre: string, apellido: string, dni: number, cuil: number, correo: string, fotoUrl: string, tipo: TipoEmpleado) {
    super(id, 'empleado', nombre, apellido, dni, correo, fotoUrl);
    this.tipo = tipo;
    this.cuil = cuil;
  }

}
export type TipoEmpleado = 'metre' | 'mozo' | 'cocinero' | 'bartender';
