import { Injectable, signal } from '@angular/core';
import { Appointment, AppointmentFormData } from '../interfaces/appointment.interface';
import { CalendarView } from '../enums/calendar-view.enum';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppointmentDialogComponent } from '../components/appointment-dialog/appointment-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  readonly monthDays = signal<Date[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly timeSlots = signal<string[]>([]);
  readonly weeks = signal<Date[][]>([]);

  private readonly viewDateSubject$ = new BehaviorSubject<Date>(new Date());
  private readonly currentViewSubject$ = new BehaviorSubject<CalendarView>(CalendarView.Month);
  private readonly selectedDateSubject$ = new BehaviorSubject<Date | null>(null);
  private readonly selectedStartTimeSubject$ = new BehaviorSubject<string | null>(null);

  constructor(private dialog: MatDialog) {
    this.generateAppointments();
    this.generateTimeSlots();
    this.generateView();
  }

  get viewDate$(): Observable<Date> {
    return this.viewDateSubject$.asObservable();
  }

  get currentView$(): Observable<CalendarView> {
    return this.currentViewSubject$.asObservable();
  }

  setViewDate(date: Date): void {
    this.viewDateSubject$.next(date);
  }

  setCurrentView(view: CalendarView): void {
    this.currentViewSubject$.next(view);
  }

  setSelectedDate(date: Date | null): void {
    this.selectedDateSubject$.next(date);
  }

  setSelectedStartTime(startTime: string | null): void {
    this.selectedStartTimeSubject$.next(startTime);
  }

  addAppointment(date: Date, title: string, startTime: string, endTime: string): void {
    this.appointments.update(appointments => [
      ...appointments,
      {
        uuid: this.generateUUID(),
        date,
        title,
        startTime,
        endTime,
        color: this.getRandomColor(),
      },
    ]);
  }

  openCreateAppointmentDialog(): Observable<AppointmentFormData> {
    const selectedDate = this.selectedDateSubject$.value;
    const selectedStartTime = this.selectedStartTimeSubject$.value;

    return this.dialog.open(AppointmentDialogComponent, {
      data: {
        date: selectedDate,
        title: '',
        startTime: selectedStartTime || this.getCurrentTime(),
        endTime: selectedStartTime || this.getCurrentTime(),
      },
      width: '500px',
      panelClass: 'dialog-container',
    })
      .afterClosed();
  }

  openEditAppointmentDialog(appointment: Appointment): Observable<AppointmentFormData> {
    return this.dialog.open(AppointmentDialogComponent, {
      data: appointment,
      width: '500px',
      panelClass: 'dialog-container',
    })
      .afterClosed();
  }

  getNextViewDate(): Date {
    const date = this.viewDateSubject$.value;
    const view = this.currentViewSubject$.value;

    if (view === 'month') {
      return new Date(date.setMonth(date.getMonth() + 1));
    } else if (view === 'week') {
      return new Date(date.setDate(date.getDate() + 7));
    } else {
      return new Date(date.setDate(date.getDate() + 1));
    }
  }

  getPreviousViewDate(): Date {
    const date = this.viewDateSubject$.value;
    const view = this.currentViewSubject$.value;

    if (view === 'month') {
      return new Date(date.setMonth(date.getMonth() - 1));
    } else if (view === 'week') {
      return new Date(date.setDate(date.getDate() - 7));
    } else {
      return new Date(date.setDate(date.getDate() - 1));
    }
  }

  drop(event: CdkDragDrop<Appointment[]>, date: Date, slot?: string) {
    const movedAppointment = event.item.data;

    movedAppointment.date = date;

    if (slot) {
      movedAppointment.startTime = slot;
      movedAppointment.endTime = slot;
    }
  }

  getAppointmentsForDateTime(date: Date, timeSlot: string): Appointment[] {
    return this.appointments()
      .filter((appointment) => this.isSameDate(appointment.date, date) && appointment.startTime <= timeSlot && appointment.endTime >= timeSlot);
  }

  updateAppointment(updatedAppointment: Omit<Appointment, 'color'>): void {
    this.appointments.update((appointments) => {
      return appointments
        .map((appointment) => appointment.uuid === updatedAppointment.uuid
          ? { ...updatedAppointment, color: appointment.color }
          : appointment
        );
    });
  }

  removeAppointment(uuid: Appointment['uuid']): void {
    this.appointments.update((appointments) =>
      appointments.filter(appointment => appointment.uuid !== uuid),
    );
  }

  generateView(): void {
    const date = this.viewDateSubject$.value;
    const view = this.currentViewSubject$.value;

    switch (view) {
      case CalendarView.Month:
        this.generateMonthView(date);
        break;
      case CalendarView.Week:
        this.generateWeekView(date);
        break;
      case CalendarView.Day:
        this.generateDayView(date);
        break;
      default:
        this.generateMonthView(date);
    }
  }

  private generateTimeSlots(): void {
    for (let hour = 0; hour <= 24; hour++) {
      const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;

      this.timeSlots.update(timeSlots => [...timeSlots, time]);
    }
  }

  private getCurrentTime(): string {
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();
    const h = hour < 10 ? `0${hour}` : hour;
    const m = minutes < 10 ? `0${minutes}` : minutes;

    return `${h}:${m}`;
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private generateWeekView(date: Date) {
    const startOfWeek = this.startOfWeek(date);
    this.monthDays.set([]);

    for (let day = 0; day < 7; day++) {
      const weekDate = new Date(startOfWeek);

      weekDate.setDate(startOfWeek.getDate() + day);

      this.monthDays.update(monthDays => [...monthDays, weekDate]);
    }
  }

  private startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(start.setDate(diff));
  }

  private generateDayView(date: Date): void {
    this.monthDays.set([date]);
  }

  private generateMonthView(date: Date): void {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.weeks.set([]);
    this.monthDays.set([]);
    let week: Date[] = [];

    for (let day = start.getDay(); day > 0; day--) {
      const prevDate = new Date(start);

      prevDate.setDate(start.getDate() - day);
      week.push(prevDate);
      this.monthDays.update(days => [...days, prevDate]);
    }

    for (let day = 1; day <= end.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);

      this.monthDays.update(days => [...days, currentDate]);
      week.push(currentDate);

      if (week.length === 7) {
        this.weeks.update(weeks => [...weeks, week]);
        week = [];
      }
    }

    for (let day = 1; this.monthDays.length % 7 !== 0; day++) {
      const nextDate = new Date(end);

      nextDate.setDate(end.getDate() + day);
      this.monthDays.update(days => [...days, nextDate]);
    }

    for (let day = 1; week.length < 7; day++) {
      const nextDate = new Date(end);

      nextDate.setDate(end.getDate() + day);
      week.push(nextDate);
    }

    if (week.length > 0) {
      this.weeks.update(weeks => [...weeks, week]);
    }
  }

  private generateAppointments(): void {
    this.appointments.set([
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        title: 'Meeting with Bob',
        startTime: '09:00',
        endTime: '10:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
        title: 'Lunch with Alice',
        startTime: '12:00',
        endTime: '13:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 3),
        title: 'Project Deadline',
        startTime: '15:00',
        endTime: '16:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        title: 'Doctor Appointment',
        startTime: '10:00',
        endTime: '11:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
        title: 'Team Meeting',
        startTime: '14:00',
        endTime: '15:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        title: 'Coffee with Mike',
        startTime: '11:00',
        endTime: '12:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4),
        title: 'Client Call',
        startTime: '09:30',
        endTime: '10:30',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 8),
        title: 'Gym',
        startTime: '17:00',
        endTime: '18:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
        title: 'Dentist Appointment',
        startTime: '11:30',
        endTime: '12:30',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2),
        title: 'Birthday Party',
        startTime: '19:00',
        endTime: '21:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 11),
        title: 'Conference',
        startTime: '13:00',
        endTime: '14:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 12),
        title: 'Workshop',
        startTime: '10:00',
        endTime: '12:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 13),
        title: 'Brunch with Sarah',
        startTime: '11:00',
        endTime: '12:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
        title: 'Networking Event',
        startTime: '18:00',
        endTime: '20:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 16),
        title: 'Yoga Class',
        startTime: '07:00',
        endTime: '08:00',
        color: this.getRandomColor(),
      },
      {
        uuid: this.generateUUID(),
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 16),
        title: 'Strategy Meeting',
        startTime: '10:00',
        endTime: '11:30',
        color: this.getRandomColor(),
      },
    ]);
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.5;

    return `rgba(${r},${g},${b},${a})`;
  }

  private generateUUID(): number {
    return Math.ceil(Math.random() * 1000000);
  }
}
