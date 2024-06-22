import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Roles_Tipos } from '../utils/interfaces/interfaces';
import { CheckRolTipo } from '../utils/check_rol_tipo';

export const rolTipoGuard: CanActivateFn = (route, state) => {
  const usuario = inject(AuthService).UsuarioEnSesion;
  const roles_tipos = route.data['roles_tipos'] as Array<Roles_Tipos>;
  const permitirAnon = route.data['permitirAnon'] as boolean;

  if (!usuario) return permitirAnon;

  if (!CheckRolTipo(usuario, roles_tipos)) {
    inject(Router).navigate(['acceso-denegado']);
    return false;
  }

  return true;
};