import {Pipe, PipeTransform} from '@angular/core';
import {NumberUtils} from "../util/number.utils";

@Pipe({
  name: 'formatNumber',
  pure: false
})
export class FormatNumberPipe implements PipeTransform {
  transform(n: number, fractionDigits: number): string {
    return NumberUtils.formatNumber(n, fractionDigits);
  }
}
