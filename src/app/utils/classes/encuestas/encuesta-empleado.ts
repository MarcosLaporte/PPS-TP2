import { Encuesta } from "./encuesta";
import { Empleado, TipoEmpleado, TurnoEmpleado } from "../usuarios/empleado";

export class EncuestaEmpleado extends Encuesta {
  turno: TurnoEmpleado;
  accion: 'entrada' | 'salida';
  condEspacio: number;
  fotoUrl: string;
  comentarios: string;
  aspectosBuenasCond: AspectosRest[];

  constructor(autor: Empleado, turno: TurnoEmpleado, accion: 'entrada' | 'salida', condEspacio: number, fotoUrl: string, comentarios: string, aspectosBuenasCond: AspectosRest[]) {
    super(autor);
    this.turno = turno;
    this.accion = accion;
    this.condEspacio = condEspacio;
    this.fotoUrl = fotoUrl;
    this.comentarios = comentarios;
    this.aspectosBuenasCond = aspectosBuenasCond;
  }
}
export type AspectosRest = 'iluminación' | 'ventilación' | 'temperatura' | 'ruido' | 'seguridad';