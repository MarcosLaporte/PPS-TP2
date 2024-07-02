import { Cliente } from "../usuarios/cliente";
import { Empleado } from "../usuarios/empleado";
import { Jefe } from "../usuarios/jefe";

export abstract class Encuesta {
  id: string;
  autor: Cliente | Empleado | Jefe;
  fecha: Date;

  constructor(autor: Cliente | Empleado | Jefe) {
    this.id = '';
    this.autor = autor;
    this.fecha = new Date();
  }
}
