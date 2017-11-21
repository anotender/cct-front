import {Component, OnInit} from '@angular/core';
import {Make} from "../../model/make";
import {MakeService} from "../../service/make.service";
import {NgProgress} from "ngx-progressbar";
import {Model} from "../../model/model";
import {Version} from "../../model/version";
import {ModelService} from "../../service/model.service";
import {Router} from "@angular/router";
import {VersionService} from "../../service/version.service";
import {RatingService} from "../../service/rating.service";
import {Observable} from "rxjs/Observable";
import {CustomErrorHandler} from "../../config/error.handler";

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {
  makes: Make[] = [];
  models: Model[] = [];
  versions: Version[] = [];
  carsToCompare: any[] = [];

  selectedMake: Make = null;
  selectedModel: Model = null;
  selectedVersion: Version = null;

  private delayDuration: number = 1000;
  private lastTimeoutId;

  constructor(private makeService: MakeService,
              private modelService: ModelService,
              private versionService: VersionService,
              private ratingService: RatingService,
              private errorHandler: CustomErrorHandler,
              private progress: NgProgress,
              private router: Router) {
  }

  ngOnInit() {
    this.progress.start();
    this.makeService
      .getMakes()
      .subscribe(makes => {
        this.makes = makes;
        this.progress.done();
      });
  }

  addToComparison(): void {
    this.progress.start();
    Observable
      .forkJoin(
        this.versionService.getVersion(this.selectedVersion.id),
        this.versionService.getRatingsForVersion(this.selectedVersion.id)
      )
      .subscribe(res => {
        this.selectedVersion = res[0];
        this.carsToCompare.push({
          'make': this.selectedMake,
          'model': this.selectedModel,
          'version': this.selectedVersion,
          'averageRating': this.ratingService.countAverageRating(res[1])
        });
        this.finishAdding();
      }, err => {
        this.errorHandler.handleError(err);
        this.finishAdding();
      });
  }

  onMakeChange(make: Make): void {
    clearTimeout(this.lastTimeoutId);
    this.lastTimeoutId = setTimeout(() => {
      this.progress.start();
      this.selectedMake = make;
      this.selectedModel = null;
      this.selectedVersion = null;
      this.models.length = 0;
      this.versions.length = 0;
      this.makeService
        .getModelsForMake(make.id)
        .subscribe(models => {
          this.models = models;
          this.progress.done();
        });
    }, this.delayDuration);
  }

  onModelChange(model: Model): void {
    clearTimeout(this.lastTimeoutId);
    this.lastTimeoutId = setTimeout(() => {
      this.progress.start();
      this.selectedModel = model;
      this.selectedVersion = null;
      this.versions.length = 0;
      this.modelService
        .getVersionsForModel(model.id)
        .subscribe(versions => {
          this.versions = versions;
          this.progress.done();
        });
    }, this.delayDuration);
  }

  removeFromComparison(c: any): void {
    this.carsToCompare = this.carsToCompare.filter(value => value !== c);
  }

  showCarInfo(id: string): void {
    this.router.navigate(['/cars', id]);
  }

  prepareNumberData(n: number): string {
    return `${this.isDataProvided(n) ? Number(n).toFixed(2) : 'No data'}`;
  }

  private isDataProvided(n: number): boolean {
    return n && n != null && n !== 0;
  }

  private finishAdding(): void {
    this.selectedMake = null;
    this.selectedModel = null;
    this.selectedVersion = null;
    this.models.length = 0;
    this.versions.length = 0;
    this.progress.done();
  }

}
