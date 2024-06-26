import { Persona } from "./persona";

export class Cliente extends Persona {
  tipo: TipoCliente;
  idMesa: string | null;
  esNuevoCliente: boolean;

  constructor(nombre: string, apellido: string, dni: number, correo: string, fotoUrl: string, tipo: TipoCliente) {
    super('cliente', nombre, apellido, dni, fotoUrl, correo);
    this.tipo = tipo;
    this.idMesa = null;
    this.esNuevoCliente = true;
  }

}
export type TipoCliente = 'registrado' | 'anonimo';
