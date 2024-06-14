export class Mesa {
  nroMesa: number;
  cantComensales: number;
  tipo: TipoMesa;
  fotoUrl: string | undefined;
  codigoQr: string[];
  disponible: boolean;

  constructor(nroMesa: number, cantComensales: number, tipo: TipoMesa, fotoUrl: string | undefined, codigoQr: string[]) {
    this.nroMesa = nroMesa;
    this.cantComensales = cantComensales;
    this.tipo = tipo;
    this.fotoUrl = fotoUrl;
    this.codigoQr = codigoQr;
    this.disponible = true
  }
}
export type TipoMesa = 'VIP' | 'discapacitados' | 'estandar';
