import {Pipe, PipeTransform} from '@angular/core';
import {Make} from "../model/make";
import {StringUtils} from "../util/string-utils";

@Pipe({
  name: 'makeFilter',
  pure: false
})
export class MakeFilterPipe implements PipeTransform {
  transform(makes: Make[], filter: string): any {
    if (!makes || StringUtils.isEmpty(filter)) {
      return makes;
    }
    return makes.filter(m => StringUtils.containsIgnoreCase(m.name, filter));
  }
}
