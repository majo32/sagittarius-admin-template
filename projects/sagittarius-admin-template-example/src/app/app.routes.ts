import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', title: 'Dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'users', title: 'Users', loadComponent: () => import('./pages/users/users').then(m => m.Users) },
  { path: 'users/new', title: 'New user', loadComponent: () => import('./pages/user-form-page/user-form-page').then(m => m.UserFormPage) },
  { path: 'users/:userId/edit', title: 'Edit user', loadComponent: () => import('./pages/user-form-page/user-form-page').then(m => m.UserFormPage) },
  { path: 'users/:userId', title: 'User detail', loadComponent: () => import('./pages/user-page/user-page').then(m => m.UserPage) },
  { path: 'form', title: 'Form', loadComponent: () => import('./pages/form-example/form-example').then(m => m.FormExample) },
  { path: 'settings', title: 'Settings', loadComponent: () => import('./pages/settings/settings').then(m => m.Settings) },
  { path: 'empty', title: 'Empty state', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound), data: { empty: true } },
  { path: '**', title: 'Page not found', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound) },
];
