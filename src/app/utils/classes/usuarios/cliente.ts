import { Persona } from "./persona";

export class Cliente extends Persona {
  tipo: TipoCliente;
  idMesa: string | null;
  estadoCliente: estadoCliente;

  constructor(id: string, nombre: string, apellido: string, dni: number, correo: string, fotoUrl: string, tipo: TipoCliente) {
    super(id, 'cliente', nombre, apellido, dni, fotoUrl, correo);
    this.tipo = tipo;
    this.idMesa = null;
    this.estadoCliente = 'pendiente';
  }

}
export type TipoCliente = 'registrado' | 'anonimo';
export type estadoCliente = 'no necesita' | 'pendiente' | 'aceptado' | 'rechazado';
