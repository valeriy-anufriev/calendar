import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup, } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { CalendarView } from './enums/calendar-view.enum';
import { Observable } from 'rxjs';
import { CalendarDayViewComponent } from './components/calendar-day-view/calendar-day-view.component';
import { IsTodayPipe } from './pipes/is-today.pipe';
import { CalendarViewBase } from './classes/calendar-view-base';
import { CalendarWeekViewComponent } from './components/calendar-week-view/calendar-week-view.component';
import { CalendarMonthViewComponent } from './components/calendar-month-view/calendar-month-view.component';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    CdkDropListGroup,
    DatePipe,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    MatIconButton,
    CommonModule,
    CdkDropListGroup,
    CalendarDayViewComponent,
    IsTodayPipe,
    CalendarWeekViewComponent,
    CalendarMonthViewComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent extends CalendarViewBase {
  readonly viewDate$: Observable<Date>;
  readonly currentView$: Observable<CalendarView>;

  public CalendarView = CalendarView;

  constructor(private router: Router) {
    super();

    this.viewDate$ = this.calendarService.viewDate$;
    this.currentView$ = this.calendarService.currentView$;

    this.setCurrentView();
  }

  switchToView(view: CalendarView): void {
    this.calendarService.setCurrentView(view);
    this.calendarService.generateView();
  }

  previous(): void {
    const previousViewDate = this.calendarService.getPreviousViewDate();

    this.calendarService.setViewDate(previousViewDate);
    this.calendarService.generateView();
  }

  next(): void {
    const nextViewDate = this.calendarService.getNextViewDate();

    this.calendarService.setViewDate(nextViewDate);
    this.calendarService.generateView();
  }

  viewToday(): void {
    this.calendarService.setViewDate(new Date());
    this.calendarService.generateView();
  }

  private setCurrentView(): void {
    if (this.router.url.includes(CalendarView.Week)) {
      return this.switchToView(CalendarView.Week);
    }

    if (this.router.url.includes(CalendarView.Day)) {
      return this.switchToView(CalendarView.Day);
    }

    this.switchToView(CalendarView.Month);
  }
}
