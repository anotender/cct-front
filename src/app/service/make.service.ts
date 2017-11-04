import {Injectable} from "@angular/core";
import {AppComponent} from "../app.component";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Make} from "../model/make";
import {Model} from "../model/model";
import {AppConfig} from "../config/app.config";

@Injectable()
export class MakeService {

  private MAKES_API_PREFIX = AppConfig.API_PREFIX + '/makes';
  private makes: Make[] = [];

  constructor(private authHttp: AuthHttp) {
  }

  getMake(makeId: string): Observable<Make> {
    let make: Make = this.makes.find(m => m.id === makeId);
    if (make) return Observable.of(make);
    return this.authHttp
      .get(this.MAKES_API_PREFIX + '/' + makeId)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getMakes(): Observable<Make[]> {
    if (this.makes.length !== 0) return Observable.of(this.makes);
    return this.authHttp
      .get(this.MAKES_API_PREFIX)
      .map(res => {
        this.makes = res.json();
        return this.makes;
      })
      .catch(err => Observable.throw(err));
  }

  getModelsForMake(makeId: string): Observable<Model[]> {
    return this.authHttp
      .get(this.MAKES_API_PREFIX + '/' + makeId + '/models')
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
