import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarViewBase } from '../../classes/calendar-view-base';
import { CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar-week-view',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
  ],
  templateUrl: './calendar-week-view.component.html',
  styleUrls: ['./calendar-week-view.component.scss', '../../styles/calendar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekViewComponent extends CalendarViewBase {}
