export interface Foto {
  id: string,
  name: string,
  date: Date,
  url: string,
}

import { TipoCliente } from "../classes/usuarios/cliente";
import { TipoEmpleado } from "../classes/usuarios/empleado";
import { TipoJefe } from "../classes/usuarios/jefe";
import { RolUsuario } from "../classes/usuarios/persona";
export interface Roles_Tipos {
  rol: RolUsuario,
  tipo?: TipoCliente | TipoEmpleado | TipoJefe
};