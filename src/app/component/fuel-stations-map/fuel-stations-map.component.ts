import {Component, OnInit} from '@angular/core';
import {FuelStationService} from "../../service/fuel-station.service";
import {FuelStation} from "../../model/fuel-station";
import {NgProgress} from "ngx-progressbar";
import {LatLngBounds} from "@agm/core";
import {MapUtils} from "../../util/map.utils";
import {FuelPriceService} from "../../service/fuel-price.service";
import {FuelPrice} from "../../model/fuel-price";
import {DateUtils} from "../../util/date.utils";
import {FuelUtils} from "../../util/fuel.utils";

@Component({
  selector: 'app-fuel-stations-map',
  templateUrl: './fuel-stations-map.component.html',
  styleUrls: ['./fuel-stations-map.component.css']
})
export class FuelStationsMapComponent implements OnInit {

  latitude: number;
  longitude: number;
  radius: number;
  centerHasChanged: boolean = false;
  fuelStations: FuelStation[] = [];
  fuelPrices: { [fuelStationId: string]: FuelPrice[] } = {};

  constructor(private fuelStationService: FuelStationService,
              private fuelPriceService: FuelPriceService,
              private progress: NgProgress) {
  }

  ngOnInit() {
    if (navigator.geolocation) {
      this.progress.start();
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.radius = 5000;
        this.progress.done();
        this.searchForFuelStations();
      });
    }
  }

  handleCenterChange(event: any): void {
    this.latitude = event.lat;
    this.longitude = event.lng;
    this.centerHasChanged = true;
  }

  handleBoundsChange(bounds: LatLngBounds): void {
    let d1: number = MapUtils.computeDistanceBetweenCoordinates(this.latitude, this.longitude, this.latitude, bounds.getNorthEast().lng());
    let d2: number = MapUtils.computeDistanceBetweenCoordinates(this.latitude, this.longitude, bounds.getNorthEast().lat(), this.longitude);
    this.radius = d1 > d2 ? Math.ceil(d1) : Math.ceil(d2);
  }

  searchForFuelStations(): void {
    this.progress.start();
    this.centerHasChanged = false;
    this.fuelStationService
      .getFuelStationsInArea(this.latitude, this.longitude, this.radius)
      .subscribe(fuelStations => {
        this.fuelStations = fuelStations;
        this.fuelPriceService
          .getFuelPricesForFuelStations(this.fuelStations.map(f => f.id))
          .subscribe(fuelPrices => {
            console.log(fuelPrices);
            fuelPrices.forEach(f => {
              if (!this.fuelPrices[f.fuelStationId]) {
                this.fuelPrices[f.fuelStationId] = [];
              }
              this.fuelPrices[f.fuelStationId].push(f);
            });
            console.log(this.fuelPrices);
            this.progress.done();
          });
      });
  }

  handleFuelPricesSaved(fuelPrices: FuelPrice[]): void {
    fuelPrices.forEach(f => {
      let previousFuelPrice: FuelPrice = this.fuelPrices[f.fuelStationId].find(fp => fp.fuel === f.fuel);
      if (!previousFuelPrice) {
        this.fuelPrices[f.fuelStationId].push(f);
      } else {
        previousFuelPrice.price = f.price;
        previousFuelPrice.date = f.date;
      }
    });
  }

  formatFuel(fuel: string): string {
    return FuelUtils.getTextForFuel(fuel);
  }

  formatDate(millis: number): string {
    return DateUtils.formatDate(millis);
  }

}
