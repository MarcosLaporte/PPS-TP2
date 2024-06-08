export class Producto {
  id: string;
  nombre: string;
  descripcion: string;
  minutosElab: number;
  precio: number;
  fotosUrl: string[];
  codigoQr: string;

  constructor(id: string, nombre: string, descripcion: string, minutosElab: number, precio: number,
      fotosUrl: string[], codigoQr: string) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.minutosElab = minutosElab;
    this.precio = precio;
    this.fotosUrl = fotosUrl;
    this.codigoQr = codigoQr;
  }
}
