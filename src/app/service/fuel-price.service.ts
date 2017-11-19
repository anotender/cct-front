import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "../config/app.config";
import {FuelPrice} from "../model/fuel-price";
import {Headers, RequestOptions} from "@angular/http";
import {NumberUtils} from "../util/number.utils";

@Injectable()
export class FuelPriceService {

  private FUEL_PRICES_API_PREFIX = AppConfig.API_PREFIX + '/fuelprices';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private authHttp: AuthHttp) {
  }

  getFuelPricesForFuelStations(fuelStationsIds: string[]): Observable<FuelPrice[]> {
    return this.authHttp
      .get(this.FUEL_PRICES_API_PREFIX + '?fuelStationId=' + fuelStationsIds.join())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  save(fuelPrice: FuelPrice): Observable<FuelPrice> {
    let body = JSON.stringify(fuelPrice);
    return this.authHttp
      .post(this.FUEL_PRICES_API_PREFIX, body, this.OPTIONS)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  countAverageFuelPrice(fuel: string, fuelPrices: FuelPrice[]): number {
    return NumberUtils.countAverage(fuelPrices.filter(fp => fp.fuel === fuel).map(fp => fp.price));
  }

}
