import { Producto } from "./producto";


export class Pedido {
    id: string;
    pedidoProd: PedidoArmado[];
    precio: number;
    tiempoEstimado: number;
    estado: EstadoPedido;
    idCliente: string;
    nroMesa: number;

    constructor( 
        id: string, pedidoProd: PedidoArmado[], precio: number, tiempoEstimado: number, idCliente: string, nroMesa: number){
        this.id = id;
        this.pedidoProd = pedidoProd;
        this.precio = precio;
        this.tiempoEstimado = tiempoEstimado;
        this.idCliente = idCliente;
        this.estado = 'pendiente';
        this.nroMesa = nroMesa;
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