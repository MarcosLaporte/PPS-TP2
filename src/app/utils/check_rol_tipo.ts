import { AuthService } from "../services/auth.service";
import { Cliente } from "./classes/usuarios/cliente";
import { Empleado } from "./classes/usuarios/empleado";
import { Jefe } from "./classes/usuarios/jefe";
import { Roles_Tipos } from "./interfaces/interfaces";

export function CheckRolTipo(auth: AuthService, roles_tipos: Roles_Tipos[] = [], permitirAnon: boolean = false): boolean {
  const usuario = auth.UsuarioEnSesion;

  if (!usuario) return !!permitirAnon;
  if (!roles_tipos || roles_tipos.length === 0) return true;

  return roles_tipos.some(rolPermitido => {

    if (!rolPermitido.tipo) { // Si no se provee un tipo específico, solo se compara el rol
      return rolPermitido.rol === usuario.rol;
    } else { // Si se provee un tipo específico, se compara el rol y el tipo
      const tipo = (() => {
        const rolesMap = {
          cliente: (usuario as Cliente).tipo,
          empleado: (usuario as Empleado).tipo,
          jefe: (usuario as Jefe).perfil
        };

        return rolesMap[usuario.rol];
      })();

      return rolPermitido.rol === usuario.rol && rolPermitido.tipo === tipo;
    }
  });
}