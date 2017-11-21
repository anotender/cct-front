import {Component, OnInit} from '@angular/core';
import {NgProgress} from "ngx-progressbar";
import {UserService} from "../../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {VersionService} from "../../service/version.service";
import {ModelService} from "../../service/model.service";
import {MakeService} from "../../service/make.service";
import {Observable} from "rxjs/Observable";
import {Model} from "../../model/model";
import {Make} from "../../model/make";
import {Version} from "../../model/version";
import {Car} from "../../model/car";
import {FuelRefill} from "../../model/fuel-refill";
import {CarService} from "../../service/car.service";
import {FuelRefillService} from "../../service/fuel-refill.service";
import {DateUtils} from "../../util/date.utils";
import {NumberUtils} from "../../util/number.utils";
import {ToastrService} from "ngx-toastr";
import {Modal} from "ngx-modialog/plugins/bootstrap";

@Component({
  selector: 'app-user-cars',
  templateUrl: './user-cars.component.html',
  styleUrls: ['./user-cars.component.css']
})
export class UserCarsComponent implements OnInit {

  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private versionService: VersionService,
              private modelService: ModelService,
              private makeService: MakeService,
              private carService: CarService,
              private fuelRefillService: FuelRefillService,
              private progress: NgProgress,
              private toastr: ToastrService,
              private modal: Modal) {
  }

  ngOnInit() {
    this.progress.start();
    this.route.params.subscribe(params => {
      this.userService
        .getCarsForUser(params['id'])
        .subscribe(cars => {
          if (cars.length === 0) {
            this.progress.done();
            return;
          }

          this.versionService
            .getVersionsForIds(cars.map(c => c.versionId))
            .subscribe(versions => {
              Observable
                .forkJoin(
                  this.modelService.getModelsForIds(versions.map(v => v.modelId)),
                  this.makeService.getMakes()
                )
                .subscribe(res => {
                  let models: Model[] = res[0];
                  let makes: Make[] = res[1];

                  this.vehicles = cars.map(car => {
                    let version: Version = versions.find(v => v.id === car.versionId);
                    let model: Model = models.find(m => m.id === version.modelId);
                    let make: Make = makes.find(m => m.id === model.makeId);
                    return {
                      car: car,
                      version: version,
                      model: model,
                      make: make,
                      fuelRefills: null
                    };
                  });
                  this.progress.done();
                });
            });
        });
    });
  }

  selectVehicle(v: Vehicle): void {
    if (this.selectedVehicle === v) {
      return;
    }

    this.selectedVehicle = v;

    if (v.fuelRefills != null) {
      return;
    }

    this.progress.start();
    Observable
      .forkJoin(
        this.carService.getFuelRefillsForCar(v.car.id)
      )
      .subscribe(res => {
        this.selectedVehicle.fuelRefills = res[0];
        this.progress.done();
      });
  }

  deleteVehicle(vehicle: Vehicle): void {
    this.showConfirmationDialog('You are trying to delete car ' + vehicle.car.name, res => {
      this.progress.start();
      this.carService
        .delete(vehicle.car.id)
        .subscribe(res => {
          this.vehicles = this.vehicles.filter(v => v !== vehicle);
          this.selectedVehicle = null;
          this.toastr.success('Car deleted');
          this.progress.done();
        });
    });
  }

  deleteFuelRefill(fuelRefill: FuelRefill): void {
    this.showConfirmationDialog('You are trying to delete fuel refill from ' + this.formatDate(fuelRefill.date), res => {
      this.progress.start();
      this.fuelRefillService
        .delete(fuelRefill.id)
        .subscribe(res => {
          this.selectedVehicle.fuelRefills = this.selectedVehicle.fuelRefills.filter(fr => fr !== fuelRefill);
          this.toastr.success('Fuel refill deleted');
          this.progress.done();
        });
    });
  }

  showCars(): void {
    this.router.navigateByUrl('/cars');
  }

  showCarInfo(id: string): void {
    this.router.navigate(['/cars', id]);
  }

  handleFuelRefillSaved(fuelRefill: FuelRefill): void {
    if (this.selectedVehicle.fuelRefills == null) {
      this.selectedVehicle.fuelRefills = [];
    }
    this.selectedVehicle.fuelRefills.push(fuelRefill);
  }

  countAverageFuelConsumption(fuelRefills: FuelRefill[]): number {
    return this.fuelRefillService.countAverageFuelConsumption(fuelRefills ? fuelRefills : []);
  }

  formatDate(millis: number): string {
    return DateUtils.formatDate(millis);
  }

  formatFuelConsumption(fuelConsumption: number): string {
    return NumberUtils.formatNumber(fuelConsumption, 2);
  }

  private showConfirmationDialog(message: string, successCallback: (any) => void): void {
    this.modal
      .confirm()
      .title('Are you sure?')
      .body(message)
      .open()
      .then(dialogRef => dialogRef.result.then(successCallback, ignore => {
      }));
  }

}

class Vehicle {
  car: Car;
  version: Version;
  model: Model;
  make: Make;
  fuelRefills: FuelRefill[] = null;
}
