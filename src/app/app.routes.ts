import { Routes } from '@angular/router';
import { sesionIniciadaGuard } from './guards/sesion-iniciada.guard';
import { rolTipoGuard } from './guards/rol-tipo.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'alta-cliente',
    loadComponent: () => import('./pages/alta-cliente/alta-cliente.page').then(m => m.AltaClientePage),
    canActivate: [rolTipoGuard],
    data: {
      permitirAnon: true,
      roles_tipos: [
        { rol: 'empleado', tipo: 'metre' }
      ]
    }
  },
  {
    path: 'alta-producto',
    loadComponent: () => import('./pages/alta-producto/alta-producto.page').then(m => m.AltaProductoPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'empleado', tipo: 'cocinero' },
        { rol: 'empleado', tipo: 'bartender' }
      ]
    }
  },
  {
    path: 'alta-supervisor',
    loadComponent: () => import('./pages/alta-supervisor/alta-supervisor.page').then(m => m.AltaSupervisorPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'jefe' }
      ]
    }
  },
  {
    path: 'alta-mesa',
    loadComponent: () => import('./pages/alta-mesa/alta-mesa.page').then(m => m.AltaMesaPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'jefe' },
      ]
    }
  },
  {
    path: 'alta-empleado',
    loadComponent: () => import('./pages/alta-empleado/alta-empleado.page').then(m => m.AltaEmpleadoPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'jefe' },
      ]
    }
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'acceso-denegado',
    loadComponent: () => import('./pages/acceso-denegado/acceso-denegado.page').then( m => m.AccesoDenegadoPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage),
    canActivate: [sesionIniciadaGuard]
  },
  {
    path: 'alta-encuesta-cliente',
    loadComponent: () => import('./pages/alta-encuesta-cliente/alta-encuesta-cliente.page').then( m => m.AltaEncuestaClientePage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'cliente' },
      ]
    }
  },
  {
    path: 'grafico-clientes',
    loadComponent: () => import('./pages/grafico-clientes/grafico-clientes.page').then( m => m.GraficoClientesPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'cliente' },
      ]
    }
  },





];
