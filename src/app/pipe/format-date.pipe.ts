import {Pipe, PipeTransform} from '@angular/core';
import {DateUtils} from "../util/date.utils";

@Pipe({
  name: 'formatDate',
  pure: false
})
export class FormatDatePipe implements PipeTransform {
  transform(millis: number): string {
    return DateUtils.formatDate(millis);
  }
}
