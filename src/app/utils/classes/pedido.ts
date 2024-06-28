import { Producto } from "./producto";


export class Pedido {
    id: string;
    pedidoProd: PedidoArmado[];
    precio: number;
    tiempoEstimado: number;
    estado: EstadoPedido;

    constructor( id : string, pedidoProd : PedidoArmado[], precio : number, tiempoEstimado : number){
        this.id = id;
        this.pedidoProd = pedidoProd;
        this.precio = precio;
        this.tiempoEstimado = tiempoEstimado;
        this.estado = 'pendiente';
    }
}

export type EstadoPedido = 'pendiente' | 'en proceso'

export interface PedidoProd{
    producto: Producto,
    cantidad: number,
};

export interface PedidoArmado{
    nombre: string,
    cantidad: number,
    tiempoEstimado: number,
};