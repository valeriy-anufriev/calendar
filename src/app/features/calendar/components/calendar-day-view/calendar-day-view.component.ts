import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { CalendarViewBase } from '../../classes/calendar-view-base';

@Component({
  selector: 'app-calendar-day-view',
  standalone: true,
  imports: [
    CdkDropListGroup,
    CommonModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
  templateUrl: './calendar-day-view.component.html',
  styleUrls: ['./calendar-day-view.component.scss', '../../styles/calendar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayViewComponent extends CalendarViewBase {}
