import { Encuesta } from "./encuesta";
import { Cliente } from "../usuarios/cliente";

export class EncuestaCliente extends Encuesta {
  puntuacionGeneral: number;
  atencion: TipoAtencion;
  comida: number;
  recomendacion: boolean;
  fotoUrls: string[];
  comentarios: string;

  constructor(autor: Cliente, puntuacionGeneral: number, comida: number, atencion: TipoAtencion, recomendacion: boolean, fotoUrls: string[], comentarios: string) {
    super(autor);
    this.puntuacionGeneral = puntuacionGeneral;
    this.comida = comida;
    this.atencion = atencion;
    this.recomendacion = recomendacion;
    this.fotoUrls = fotoUrls;
    this.comentarios = comentarios;
  }
}
export type TipoAtencion = 'muy mala' | 'mala' | 'buena' | 'excelente';