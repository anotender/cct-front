import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Version} from "../model/version";
import {Rating} from "../model/rating";
import {AppConfig} from "../config/app.config";

@Injectable()
export class VersionService {

  private VERSIONS_API_PREFIX = AppConfig.API_PREFIX + '/versions';

  constructor(private authHttp: AuthHttp) {
  }

  getVersion(versionId: string): Observable<Version> {
    return this.authHttp
      .get(this.VERSIONS_API_PREFIX + '/' + versionId)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getRatingsForVersion(versionId: string): Observable<Rating[]> {
    return this.authHttp
      .get(this.VERSIONS_API_PREFIX + '/' + versionId + '/ratings')
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getVersionsForIds(ids: string[]): Observable<Version[]> {
    return this.authHttp
      .get(this.VERSIONS_API_PREFIX + '?id=' + ids.join())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getVersionsOrderedByPopularity(limit: number): Observable<Version[]> {
    return this.authHttp
      .get(this.VERSIONS_API_PREFIX + '?search=orderByPopularity&limit=' + limit)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
