import {Pipe, PipeTransform} from '@angular/core';
import {Make} from "../model/make";
import {StringUtils} from "../util/string-utils";
import {Version} from "../model/version";

@Pipe({
  name: 'versionFilter',
  pure: false
})
export class VersionFilterPipe implements PipeTransform {
  transform(versions: Version[], filter: string): any {
    if (!versions || StringUtils.isEmpty(filter)) {
      return versions;
    }
    return versions.filter(v => StringUtils.containsIgnoreCase(v.name, filter));
  }
}
