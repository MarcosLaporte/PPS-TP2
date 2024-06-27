import { Cliente } from "./usuarios/cliente";

export class EncuestaCliente {
  id: string;
  autor: Cliente;
  fecha: Date;
  puntuacionGeneral: number;
  atencion:'muy mala'|'mala'|'buena'|'excelente';
  comida:number;
  recomendacion:boolean;
  fotoUrls: string[];
  comentarios: string;

  constructor(autor: Cliente, puntuacionGeneral: number,comida:number,atencion: 'muy mala'|'mala'|'buena'|'excelente', recomendacion:boolean, fotoUrls: string[], comentarios: string, fecha: Date) {
    this.id = '';
    this.autor = autor;
    this.fecha = fecha;
    this.puntuacionGeneral = puntuacionGeneral;
    this.comida = comida;
    this.atencion = atencion;
    this.recomendacion = recomendacion;
    this.fotoUrls = fotoUrls;
    this.comentarios = comentarios;
  }
}
