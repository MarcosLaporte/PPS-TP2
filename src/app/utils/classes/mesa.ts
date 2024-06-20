export class Mesa {
  id: string;
  nroMesa: number;
  cantComensales: number;
  tipo: TipoMesa;
  fotoUrl: string | undefined;
  codigoQr: string[];
  estado: EstadoMesa;

  constructor(id: string, nroMesa: number, cantComensales: number, tipo: TipoMesa, fotoUrl: string | undefined, codigoQr: string[]) {
    this.id = id;
    this.nroMesa = nroMesa;
    this.cantComensales = cantComensales;
    this.tipo = tipo;
    this.fotoUrl = fotoUrl;
    this.codigoQr = codigoQr;
    this.estado = 'disponible'
  }
}
export type EstadoMesa = 'disponible' | 'cliente sin pedido' | 'cliente esperando comida' | 'cliente comiendo' | 'cliente pagando';
export type TipoMesa = 'VIP' | 'discapacitados' | 'estandar';
