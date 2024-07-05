import { Routes } from '@angular/router';
import { sesionIniciadaGuard } from './guards/sesion-iniciada.guard';
import { rolTipoGuard } from './guards/rol-tipo.guard';
import { clienteAceptadoGuard } from './guards/cliente-aceptado.guard';

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
    loadComponent: () => import('./pages/altas/alta-cliente/alta-cliente.page').then(m => m.AltaClientePage),
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
    loadComponent: () => import('./pages/altas/alta-producto/alta-producto.page').then(m => m.AltaProductoPage),
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
    loadComponent: () => import('./pages/altas/alta-supervisor/alta-supervisor.page').then(m => m.AltaSupervisorPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'jefe' }
      ]
    }
  },
  {
    path: 'alta-mesa',
    loadComponent: () => import('./pages/altas/alta-mesa/alta-mesa.page').then(m => m.AltaMesaPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'jefe' },
      ]
    }
  },
  {
    path: 'alta-empleado',
    loadComponent: () => import('./pages/altas/alta-empleado/alta-empleado.page').then(m => m.AltaEmpleadoPage),
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
    loadComponent: () => import('./pages/acceso-denegado/acceso-denegado.page').then(m => m.AccesoDenegadoPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
    canActivate: [sesionIniciadaGuard]
  },
  {
    path: 'alta-pedido',
    loadComponent: () => import('./pages/altas/alta-pedido/alta-pedido.page').then(m => m.AltaPedidoPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard, clienteAceptadoGuard],
    data: {
      roles_tipos: [
        { rol: 'empleado', tipo: 'mozo' },
        { rol: 'cliente' },
      ]
    }
  },
  {
    path: 'alta-encuesta-empleado',
    loadComponent: () => import('./pages/encuestas/alta-encuestas-empleados/alta-encuestas-empleados.page').then(m => m.AltaEncuestasEmpleadosPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'empleado' },
      ]
    }
  },
  {
    path: 'lista-encuestas-empleados',
    loadComponent: () => import('./pages/encuestas/lista-encuestas-empleados/lista-encuestas-empleados.page').then(m => m.ListaEncuestasEmpleadosPage),
  },
  {
    path: 'lista-clientes-pendientes',
    loadComponent: () => import('./pages/listas/lista-clientes-pendientes/lista-clientes-pendientes.page').then(m => m.ListaClientesPendientesPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'jefe' },
      ]
    }
  },
  {
    path: 'clientes-espera',
    loadComponent: () => import('./pages/clientes-espera/clientes-espera.page').then(m => m.ClientesEsperaPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'cliente' },
      ],
    }
  },
  {
    path: 'alta-encuesta-cliente',
    loadComponent: () => import('./pages/encuestas/alta-encuesta-cliente/alta-encuesta-cliente.page').then(m => m.AltaEncuestaClientePage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard, clienteAceptadoGuard],
    data: {
      roles_tipos: [
        { rol: 'cliente' },
      ]
    }
  },
  {
    path: 'grafico-clientes',
    loadComponent: () => import('./pages/grafico-clientes/grafico-clientes.page').then(m => m.GraficoClientesPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'cliente' },
        { rol: 'jefe' }
      ]
    }
  },
  {
    path: 'alta-cliente-anon',
    loadComponent: () => import('./pages/altas/alta-cliente-anon/alta-cliente-anon.page').then(m => m.AltaClienteAnonPage),
  },
  {
    path: 'lista-espera',
    loadComponent: () => import('./pages/listas/lista-espera/lista-espera.page').then(m => m.ListaEsperaPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'empleado', tipo: 'metre' }
      ]
    }
  },
  {
    path: 'alta-encuesta-supervisor',
    loadComponent: () => import('./pages/encuestas/alta-encuesta-supervisor/alta-encuesta-supervisor.page').then(m => m.AltaEncuestaSupervisorPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'jefe' },
      ]
    }
  },
  {
    path: 'consulta-mozo',
    loadComponent: () => import('./pages/consulta-mozo/consulta-mozo.page').then(m => m.ConsultaMozoPage),
    canActivate: [sesionIniciadaGuard],
  },
  {
    path: 'lista-pedidos-pendiente',
    loadComponent: () => import('./pages/listas/lista-pedidos-pendiente/lista-pedidos-pendiente.page').then(m => m.ListaPedidosPendientePage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'empleado', tipo: 'mozo' },
        { rol: 'empleado', tipo: 'bartender' },
        { rol: 'empleado', tipo: 'cocinero' }
      ]
    }
  },
  {
    path: 'lista-clientes-pagando',
    loadComponent: () => import('./pages/listas/lista-clientes-pagando/lista-clientes-pagando.page').then( m => m.ListaClientesPagandoPage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'empleado', tipo: 'mozo' }
      ]
    }
  },
  {
    path: 'lista-encuestas-cliente',
    loadComponent: () => import('./pages/encuestas/lista-encuestas-cliente/lista-encuestas-cliente.page').then( m => m.ListaEncuestasClientePage),
    canActivate: [sesionIniciadaGuard, rolTipoGuard],
    data: {
      roles_tipos: [
        { rol: 'cliente' },
        { rol: 'jefe' }
      ]
    }
  },
];
