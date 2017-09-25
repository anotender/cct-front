import {Injectable} from "@angular/core";
import {AppComponent} from "../app.component";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Make} from "../model/make";
import {Model} from "../model/model";

@Injectable()
export class MakeService {

  private MAKES_API_PREFIX = AppComponent.API_PREFIX + '/makes';

  constructor(private authHttp: AuthHttp) {
  }

  getMake(makeId: string): Observable<Make> {
    return this.authHttp
      .get(this.MAKES_API_PREFIX + '/' + makeId)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getMakes(): Observable<Make[]> {
    return this.authHttp
      .get(this.MAKES_API_PREFIX)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getModelsForMake(makeId: string): Observable<Model[]> {
    return this.authHttp
      .get(this.MAKES_API_PREFIX + '/' + makeId + '/models')
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
