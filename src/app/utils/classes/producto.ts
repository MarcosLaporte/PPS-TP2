export class Producto {
  id: string;
  nombre: string;
  descripcion: string;
  tiempoElab: number; // Combined time in seconds
  precio: number;
  fotosUrl: string[];

  constructor(id: string, nombre: string, descripcion: string, tiempoElab: number, precio: number,
      fotosUrl: string[]) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.tiempoElab = tiempoElab;
    this.precio = precio;
    this.fotosUrl = fotosUrl;
  }
}
