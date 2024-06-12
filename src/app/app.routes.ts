import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'alta-producto',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'alta-cliente',
    loadComponent: () => import('./pages/alta-cliente/alta-cliente.page').then( m => m.AltaClientePage)
  },
  {
    path: 'alta-producto',
    loadComponent: () => import('./pages/alta-producto/alta-producto.page').then( m => m.AltaProductoPage)
  },
  {
    path: 'alta-supervisor',
    loadComponent: () => import('./pages/alta-supervisor/alta-supervisor.page').then( m => m.AltaSupervisorPage)
  },
  {
    path: 'alta-mesa',
    loadComponent: () => import('./pages/alta-mesa/alta-mesa.page').then( m => m.AltaMesaPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
];