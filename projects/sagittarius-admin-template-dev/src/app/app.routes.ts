import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', title: 'Prehľad', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'users', title: 'Používatelia', loadComponent: () => import('./pages/users/users').then(m => m.Users) },
  { path: 'users/new', title: 'Nový používateľ', loadComponent: () => import('./pages/user-form-page/user-form-page').then(m => m.UserFormPage) },
  { path: 'users/:userId/edit', title: 'Úprava používateľa', loadComponent: () => import('./pages/user-form-page/user-form-page').then(m => m.UserFormPage) },
  { path: 'users/:userId', title: 'Detail používateľa', loadComponent: () => import('./pages/user-page/user-page').then(m => m.UserPage) },
  { path: 'form', title: 'Formulár', loadComponent: () => import('./pages/form-example/form-example').then(m => m.FormExample) },
  { path: 'settings', title: 'Nastavenia', loadComponent: () => import('./pages/settings/settings').then(m => m.Settings) },
  { path: 'empty', title: 'Prázdny stav', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound), data: { empty: true } },
  { path: '**', title: 'Stránka neexistuje', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) },
];
