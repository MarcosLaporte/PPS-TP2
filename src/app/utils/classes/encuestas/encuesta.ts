import { Persona } from "../usuarios/persona";

export abstract class Encuesta {
  id: string;
  autor: Persona;
  fecha: Date;

  constructor(autor: Persona) {
    this.id = '';
    this.autor = autor;
    this.fecha = new Date();
  }
}
