import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Cidade em Ordem',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'admin',
    title: 'Painel Administrativo | Cidade em Ordem',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
  },
  { path: '**', redirectTo: '' },
];
