import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'calendar',
    loadChildren: () => import('./features/calendar/calendar.routes').then((m) => m.routes),
  },
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
];
