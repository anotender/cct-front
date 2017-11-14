import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgProgress} from "ngx-progressbar";
import {VersionService} from "../../service/version.service";
import {ModelService} from "../../service/model.service";
import {MakeService} from "../../service/make.service";
import {Observable} from "rxjs/Observable";
import {Model} from "../../model/model";
import {Make} from "../../model/make";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  popularVersions: any[] = [];

  constructor(private router: Router,
              private progress: NgProgress,
              private versionService: VersionService,
              private modelService: ModelService,
              private makeService: MakeService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.progress.start();
    this.versionService
      .getVersionsOrderedByPopularity(5)
      .subscribe(versions => {
        let modelIds: string[] = versions
          .filter(v => v.cars.length !== 0)
          .map(version => version.modelId);

        if (modelIds.length === 0) {
          this.progress.done();
          return;
        }

        Observable
          .forkJoin(
            this.modelService.getModelsForIds(modelIds),
            this.makeService.getMakes()
          )
          .subscribe(res => {
            let models: Model[] = res[0];
            let makes: Make[] = res[1];
            this.popularVersions = versions
              .filter(v => v.cars.length !== 0)
              .map(version => {
                let model: Model = models.find(model => model.id === version.modelId);
                let make: Make = makes.find(make => make.id === model.makeId);
                return {
                  version: version,
                  model: model,
                  make: make
                };
              });
            this.progress.done();
          });
      });
  }

  showCars(): void {
    this.router.navigateByUrl('/cars');
  }

  showUserCars(): void {
    this.router.navigateByUrl('/users/' + this.authService.getCurrentUserId() + '/cars');
  }

  showCarsComparison(): void {
    this.router.navigateByUrl('/compare');
  }

  showCarInfo(id: string): void {
    this.router.navigate(['/cars', id]);
  }

  showFuelStations(): void {
    this.router.navigateByUrl('/fuel-stations-map');
  }

}
