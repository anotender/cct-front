import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgProgressService} from "ngx-progressbar";
import {Version} from "../../model/version";
import {VersionService} from "../../service/version.service";
import {ModelService} from "../../service/model.service";
import {MakeService} from "../../service/make.service";
import {Observable} from "rxjs/Observable";
import {Model} from "../../model/model";
import {Make} from "../../model/make";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  popularVersions: any[] = [];

  constructor(private router: Router,
              private progressService: NgProgressService,
              private versionService: VersionService,
              private modelService: ModelService,
              private makeService: MakeService) {
  }

  ngOnInit(): void {
    this.progressService.start();
    this.versionService
      .getVersionsOrderedByPopularity(5)
      .subscribe(versions => {
        let modelIds: string[] = Array.from(new Set(versions.filter(v => v.cars.length !== 0).map(version => version.modelId)));

        if (modelIds.length === 0) {
          this.progressService.done();
          return;
        }

        Observable
          .forkJoin(modelIds.map(modelId => this.modelService.getModel(modelId)))
          .subscribe(models => {
            let makeIds: string[] = Array.from(new Set(models.map(model => model.makeId)));
            Observable
              .forkJoin(makeIds.map(makeId => this.makeService.getMake(makeId)))
              .subscribe(makes => {
                versions.forEach(version => {
                  let model: Model = models.find(model => model.id === version.modelId);
                  let make: Make = makes.find(make => make.id === model.makeId);
                  this.popularVersions.push({
                    version: version,
                    model: model,
                    make: make
                  });
                });
                this.progressService.done();
              }, err => {
                console.log(err);
                this.progressService.done();
              });
          }, err => {
            console.log(err);
            this.progressService.done();
          });
      }, err => {
        console.log(err);
        this.progressService.done();
      });
  }

  showCars(): void {
    this.router.navigateByUrl('/cars');
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
