import {Injectable} from "@angular/core";
import {AppComponent} from "../app.component";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Version} from "../model/version";
import {Rating} from "../model/rating";

@Injectable()
export class VersionService {

  private VERSIONS_API_PREFIX = AppComponent.API_PREFIX + '/versions';

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

  getVersionsOrderedByPopularity(limit: number): Observable<Version[]> {
    return this.authHttp
      .get(this.VERSIONS_API_PREFIX + '?orderbypopularity=true&limit=' + limit)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
