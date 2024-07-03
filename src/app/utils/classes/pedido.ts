import { Producto } from "./producto";

export class Pedido {
  id: string;
  pedidoProd: PedidoArmado[];
  precio: number;
  tiempoEstimado: number;
  estado: EstadoPedido;
  idCliente: string | null;

  constructor(pedidoProd: PedidoArmado[], precio: number, tiempoEstimado: number, idCliente: string | null) {
    this.id = '';
    this.pedidoProd = pedidoProd;
    this.precio = precio;
    this.tiempoEstimado = tiempoEstimado;
    this.estado = 'pendiente';
    this.idCliente = idCliente;
  }
}

export type EstadoPedido = 'pendiente' | 'en proceso' | 'entregado';
export interface PedidoProd {
  producto: Producto,
  cantidad: number,
};
export interface PedidoArmado {
  nombre: string,
  cantidad: number,
  tiempoEstimado: number,
};