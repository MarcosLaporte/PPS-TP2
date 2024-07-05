import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Empleado } from '../utils/classes/usuarios/empleado';
import { Cliente } from '../utils/classes/usuarios/cliente';
import { ToastError } from '../utils/alerts';

export const accesoChatGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const usuarioEnSesion = auth.UsuarioEnSesion;

  if (!usuarioEnSesion) return false;
  
  const { rol } = usuarioEnSesion;
  let mensajeError = '';
  
  if (rol === 'empleado') {
    const empleado = usuarioEnSesion as Empleado;
    if (empleado.tipo !== 'mozo') {
      mensajeError = 'Solo los mozos pueden acceder al chat con los clientes.';
    }
  } else if (rol === 'cliente') {
    const cliente = usuarioEnSesion as Cliente;
    if (!cliente.idMesa) {
      mensajeError = 'Debe tener una mesa asignada para acceder al chat con los mozos.';
    }
  } else {
    mensajeError = 'Solo los mozos y clientes pueden acceder al chat.';
  }
  
  if (mensajeError) {
    ToastError.fire(mensajeError);
    inject(Router).navigate(['acceso-denegado']);
    return false;
  }
  
  return true;
};
