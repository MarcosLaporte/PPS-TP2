import { Persona } from "./persona";

export class Cliente extends Persona {
  tipo: TipoCliente

  constructor(id: string, nombre: string, apellido: string, dni: number, fotoUrl: string, tipo: TipoCliente) {
    super(id, 'cliente', nombre, apellido, dni, fotoUrl);
    this.tipo = tipo;
  }

}
export type TipoCliente = 'registrado' | 'anonimo';