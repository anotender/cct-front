import {Component, OnInit} from '@angular/core';
import {FuelStationService} from "../../service/fuel-station.service";
import {FuelStation} from "../../model/fuel-station";
import {NgProgressService} from "ngx-progressbar";
import {LatLngBounds} from "@agm/core";
import {MapUtils} from "../../util/map.utils";

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

  constructor(private fuelStationService: FuelStationService, private progressService: NgProgressService) {
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.radius = 5000;
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
    this.progressService.start();
    this.centerHasChanged = false;
    this.fuelStationService
      .getFuelStationsInArea(this.latitude, this.longitude, this.radius)
      .subscribe(fuelStations => {
        this.fuelStations = fuelStations;
        this.progressService.done();
      }, err => {
        console.log(err);
        this.progressService.done();
      });
  }

}
