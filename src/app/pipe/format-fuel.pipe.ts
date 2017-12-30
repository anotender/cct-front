import {Pipe, PipeTransform} from '@angular/core';
import {FuelUtils} from "../util/fuel.utils";

@Pipe({
  name: 'formatFuel',
  pure: false
})
export class FormatFuelPipe implements PipeTransform {
  transform(fuel: string): string {
    return FuelUtils.getTextForFuel(fuel);
  }
}
