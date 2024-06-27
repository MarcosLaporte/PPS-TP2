export class Pedido {
  id: string;
  mesaId: string;
  pedidos: string[];
  valorTotal: number;
  tiempoEstimado: number;
  mozoConfirma: boolean;
  clienteConfirma: boolean;

  constructor (id: string, mesaId: string, pedidos: string[], valorTotal: number, tiempoEstimado: number) {
    this.id = id;
    this.mesaId = mesaId;
    this.pedidos = pedidos;
    this.valorTotal = valorTotal;
    this.tiempoEstimado = tiempoEstimado;
    this.mozoConfirma = false;
    this.clienteConfirma = false;
  }
}
