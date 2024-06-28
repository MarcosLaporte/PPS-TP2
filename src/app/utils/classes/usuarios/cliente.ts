import { Persona } from "./persona";

export class Cliente extends Persona {
  tipo: TipoCliente;
  idMesa: string | null;
  estadoCliente: estadoCliente;

  constructor(nombre: string, apellido: string, dni: number, correo: string, fotoUrl: string, tipo: TipoCliente) {
    super('cliente', nombre, apellido, dni, fotoUrl, correo);
    this.tipo = tipo;
    this.idMesa = null;
    this.estadoCliente = 'pendiente';
  }
  
  static crearClienteAnon(nombre: string, fotoUrl: string) {
    return new Cliente(nombre, '', 0, '', fotoUrl, "anonimo");
  }

}
export type TipoCliente = 'registrado' | 'anonimo';
export type estadoCliente = 'no necesita' | 'pendiente' | 'aceptado' | 'rechazado';
