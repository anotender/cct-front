import {Injectable} from "@angular/core";
import {Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "../config/app.config";
import {FuelRefill} from "../model/fuel-refill";
import {NumberUtils} from "../util/number.utils";

@Injectable()
export class FuelRefillService {

  private FUEL_REFILLS_API_PREFIX = AppConfig.API_PREFIX + '/fuelrefills';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private authHttp: AuthHttp) {
  }

  save(fuelRefill: FuelRefill): Observable<FuelRefill> {
    let body = JSON.stringify(fuelRefill);
    return this.authHttp
      .post(this.FUEL_REFILLS_API_PREFIX, body, this.OPTIONS)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  delete(id: number): Observable<any> {
    return this.authHttp
      .delete(this.FUEL_REFILLS_API_PREFIX + '/' + id)
      .catch(err => Observable.throw(err));
  }

  countAverageFuelConsumption(fuelRefills: FuelRefill[]): number {
    let totalDistance: number = NumberUtils.countSum(fuelRefills.map(fr => fr.distance));
    let totalLiters: number = NumberUtils.countSum(fuelRefills.map(fr => fr.liters));
    return totalLiters * 100 / totalDistance;
  }

}
