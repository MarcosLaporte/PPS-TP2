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
    this.estado = EstadoMesa.Disponible;
  }
}
export type TipoMesa = 'VIP' | 'discapacitados' | 'estandar';
export enum EstadoMesa {
  Disponible,
  Asignada,
  SinPedido,
  PidiendoComida,
  EsperandoComida,
  Comiendo,
  Pagando
};

export const parseEstadoMesa = (estado: EstadoMesa): string => {
  const estados = [
    'Mesa Disponible',
    'Mesa Asignada',
    'Cliente sin pedido',
    'Cliente pidiendo comida',
    'Cliente esperando comida',
    'Cliente comiendo',
    'Cliente pagando'
  ];

  return estados[estado];
}
