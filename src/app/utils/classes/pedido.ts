import { Producto } from "./producto";

export class Pedido {
  id: string;
  pedidoProd: PedidoArmado[];
  precio: number;
  tiempoEstimado: number;
  estado: EstadoPedido;
  idCliente: string;
  confirmaciones: {
    cocina: boolean,
    barra: boolean
  };
  
  constructor(pedidoProd: PedidoArmado[], precio: number, tiempoEstimado: number, idCliente: string = '') {
    this.id = '';
    this.pedidoProd = pedidoProd;
    this.precio = precio;
    this.tiempoEstimado = tiempoEstimado;
    this.estado = 'pendiente';
    this.idCliente = idCliente;
    this.confirmaciones = {
      cocina: false,
      barra: false
    };
  }
}

export type EstadoPedido = 'pendiente' | 'en proceso' | 'listo' | 'entregado';
export interface PedidoProd {
  producto: Producto,
  cantidad: number,
};
export interface PedidoArmado {
  nombre: string,
  cantidad: number,
  tiempoEstimado: number,
  sector: 'cocina' | 'barra';
};