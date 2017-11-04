import {Injectable} from "@angular/core";
import {Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Car} from "../model/car";
import {AppConfig} from "../config/app.config";

@Injectable()
export class CarService {

  private CARS_API_PREFIX = AppConfig.API_PREFIX + '/cars';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private authHttp: AuthHttp) {
  }

  save(car: Car): Observable<any> {
    let body = JSON.stringify(car);
    return this.authHttp
      .post(this.CARS_API_PREFIX, body, this.OPTIONS)
      .catch(err => Observable.throw(err));
  }

}
