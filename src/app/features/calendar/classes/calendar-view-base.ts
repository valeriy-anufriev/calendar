import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Appointment } from '../interfaces/appointment.interface';
import { CalendarService } from '../services/calendar.service';
import { DestroyRef, inject } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

export class CalendarViewBase {
  readonly weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  protected calendarService = inject(CalendarService);
  protected destroyRef = inject(DestroyRef);

  get timeSlots() {
    return this.calendarService.timeSlots();
  }

  get monthDays() {
    return this.calendarService.monthDays();
  }

  get weeks() {
    return this.calendarService.weeks();
  }

  get appointments() {
    return this.calendarService.appointments();
  }

  getAppointmentsForDateTime(date: Date, timeSlot: string): Appointment[] {
    return this.calendarService.getAppointmentsForDateTime(date, timeSlot);
  }

  drop(event: CdkDragDrop<Appointment[]>, date: Date, slot?: string): void {
    this.calendarService.drop(event, date, slot);
  }

  selectDate(date?: Date, startTime?: string): void {
    this.calendarService.setSelectedDate(date || new Date());
    this.calendarService.setSelectedStartTime(startTime || null);

    this.calendarService.openCreateAppointmentDialog()
      .pipe(
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.calendarService.addAppointment(result.date, result.title, result.startTime, result.endTime);
      });
  }

  editAppointment(appointment: Appointment, event: Event): void {
    event.preventDefault();

    this.calendarService.openEditAppointmentDialog(appointment)
      .pipe(
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        result.remove
          ? this.calendarService.removeAppointment(result.uuid)
          : this.calendarService.updateAppointment(result);
      });
  }
}
