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


];
