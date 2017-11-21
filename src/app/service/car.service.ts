import {Injectable} from "@angular/core";
import {Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Car} from "../model/car";
import {AppConfig} from "../config/app.config";
import {FuelRefill} from "../model/fuel-refill";

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

  delete(id: number): Observable<any> {
    return this.authHttp
      .delete(this.CARS_API_PREFIX + '/' + id)
      .catch(err => Observable.throw(err));
  }

  getFuelRefillsForCar(carId: number): Observable<FuelRefill[]> {
    return this.authHttp
      .get(this.CARS_API_PREFIX + '/' + carId + '/fuelrefills')
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getCarEventsForCar(carId: number): Observable<any> {
    return Observable.empty();
  }

}
