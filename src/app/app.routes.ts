import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  // {
  //   path: 'dashboard',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./features/layout/layout.component').then((m) => m.LayoutComponent),
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'upload',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'upload',
  //       loadComponent: () =>
  //         import('./features/upload/upload.component').then((m) => m.UploadComponent),
  //     },
  //     {
  //       path: 'notas',
  //       loadComponent: () =>
  //         import('./features/nfe/nfe-list/nfe-list.component').then((m) => m.NFeListComponent),
  //     },
  //     {
  //       path: 'notas/:id',
  //       loadComponent: () =>
  //         import('./features/nfe/nfe-detail/nfe-detail.component').then(
  //           (m) => m.NFeDetailComponent
  //         ),
  //     },
  //   ],
  // },
  {
    path: '**',
    redirectTo: '/login',
  },
];
