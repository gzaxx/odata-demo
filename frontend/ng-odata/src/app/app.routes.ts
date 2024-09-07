import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./grid/grid.component').then((m) => m.GridComponent),
  },
];
