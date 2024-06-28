import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Cliente } from '../utils/classes/usuarios/cliente';
import { ToastError } from 'src/app/utils/alerts';

export const clienteAceptadoGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  
  let cliente : Cliente= <Cliente>auth.UsuarioEnSesion;
  
  if(cliente.estadoCliente == 'aceptado' || 'no necesita'){
    console.log("A");
    return true;
  }else{
    ToastError.fire(
    `Acceso denegado su registro ${(cliente.estadoCliente == 'rechazado')?'fue denegado':'todavia no fue aceptado'}`)
    return false;  
  }

};
