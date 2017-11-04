import {Pipe, PipeTransform} from '@angular/core';
import {Make} from "../model/make";
import {StringUtils} from "../util/string.utils";
import {Model} from "../model/model";

@Pipe({
  name: 'modelFilter',
  pure: false
})
export class ModelFilterPipe implements PipeTransform {
  transform(models: Model[], filter: string): any {
    if (!models || StringUtils.isEmpty(filter)) {
      return models;
    }
    return models.filter(m => StringUtils.containsIgnoreCase(m.name, filter));
  }
}
