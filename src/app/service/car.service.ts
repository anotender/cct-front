import {Injectable} from "@angular/core";
import {Headers, RequestOptions} from "@angular/http";
import {AppComponent} from "../app.component";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Car} from "../model/car";

@Injectable()
export class CarService {

  private CARS_API_PREFIX = AppComponent.API_PREFIX + '/cars';
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
