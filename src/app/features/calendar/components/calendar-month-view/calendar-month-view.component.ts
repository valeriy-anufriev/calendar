import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { IsTodayPipe } from '../../pipes/is-today.pipe';
import { CalendarViewBase } from '../../classes/calendar-view-base';
import { IsSameDatePipe } from '../../pipes/is-same-date.pipe';

@Component({
  selector: 'app-calendar-month-view',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, CdkDropList, IsTodayPipe, IsSameDatePipe, CdkDrag, CdkDragHandle],
  templateUrl: './calendar-month-view.component.html',
  styleUrls: ['./calendar-month-view.component.scss', '../../styles/calendar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthViewComponent extends CalendarViewBase {}
