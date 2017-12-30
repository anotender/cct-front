import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "../config/app.config";
import {FuelStation} from "../model/fuel-station";

@Injectable()
export class FuelStationService {

  private FUEL_STATIONS_API_PREFIX = AppConfig.API_PREFIX + '/fuelstations';

  constructor(private authHttp: AuthHttp) {
  }

  getFuelStation(id: string): Observable<FuelStation> {
    return this.authHttp
      .get(this.FUEL_STATIONS_API_PREFIX + '/' + id)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getFuelStationsInArea(latitude: number, longitude: number, radius: number): Observable<FuelStation[]> {
    return this.authHttp
      .get(this.FUEL_STATIONS_API_PREFIX + '?latitude=' + latitude + '&longitude=' + longitude + '&radius=' + radius)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
