import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isSameDate',
  standalone: true,
})
export class IsSameDatePipe implements PipeTransform {

  transform(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

}
