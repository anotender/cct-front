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

@Component({
  selector: 'app-user-cars',
  templateUrl: './user-cars.component.html',
  styleUrls: ['./user-cars.component.css']
})
export class UserCarsComponent implements OnInit {

  cars: any[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private versionService: VersionService,
              private modelService: ModelService,
              private makeService: MakeService,
              private progress: NgProgress) {
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

                  this.cars = cars
                    .map(car => {
                      let version: Version = versions.find(v => v.id === car.versionId);
                      let model: Model = models.find(m => m.id === version.modelId);
                      let make: Make = makes.find(m => m.id === model.makeId);
                      return {
                        car: car,
                        version: version,
                        model: model,
                        make: make
                      };
                    });
                  console.log(this.cars);
                  this.progress.done();
                });
            });
        });
    });
  }

  showCarInfo(id: string): void {
    this.router.navigate(['/cars', id]);
  }

}
