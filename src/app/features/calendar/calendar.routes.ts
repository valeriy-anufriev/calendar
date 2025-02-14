import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';

export const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    children: [
      {
        path: '',
        redirectTo: 'month',
        pathMatch: 'full',
      },
      {
        path: 'month',
        loadComponent: () => import('./components/calendar-month-view/calendar-month-view.component').then((m) => m.CalendarMonthViewComponent),
      },
      {
        path: 'week',
        loadComponent: () => import('./components/calendar-week-view/calendar-week-view.component').then((m) => m.CalendarWeekViewComponent),
      },
      {
        path: 'day',
        loadComponent: () => import('./components/calendar-day-view/calendar-day-view.component').then((m) => m.CalendarDayViewComponent),
      },
      {
        path: '**',
        redirectTo: 'month',
      },
    ],
  },
];
