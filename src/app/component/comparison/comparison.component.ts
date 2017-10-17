import {Component, OnInit} from '@angular/core';
import {Make} from "../../model/make";
import {MakeService} from "../../service/make.service";
import {NgProgressService} from "ngx-progressbar";
import {Model} from "../../model/model";
import {Version} from "../../model/version";
import {ModelService} from "../../service/model.service";
import {Router} from "@angular/router";
import {VersionService} from "../../service/version.service";
import {RatingService} from "../../service/rating.service";
import {Observable} from "rxjs/Observable";

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

  constructor(private makeService: MakeService,
              private modelService: ModelService,
              private versionService: VersionService,
              private ratingService: RatingService,
              private progressService: NgProgressService,
              private router: Router) {
  }

  ngOnInit() {
    this.progressService.start();
    this.makeService
      .getMakes()
      .subscribe(makes => {
        this.makes = makes;
        this.progressService.done();
      }, err => {
        console.log(err);
        this.progressService.done();
      });
  }

  addToComparison(): void {
    this.progressService.start();
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
        console.log(err);
        this.finishAdding();
      });
  }

  onMakeChange(make: Make): void {
    this.progressService.start();
    this.selectedMake = make;
    this.selectedModel = null;
    this.selectedVersion = null;
    this.models.length = 0;
    this.versions.length = 0;
    this.makeService
      .getModelsForMake(make.id)
      .subscribe(models => {
          this.models = models;
          this.progressService.done();
        }, err => {
          console.log(err);
          this.progressService.done();
        }
      );
  }

  onModelChange(model: Model): void {
    this.progressService.start();
    this.selectedModel = model;
    this.selectedVersion = null;
    this.versions.length = 0;
    this.modelService
      .getVersionsForModel(model.id)
      .subscribe(versions => {
        this.versions = versions;
        this.progressService.done();
      }, err => {
        console.log(err);
        this.progressService.done();
      });
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
    this.progressService.done();
  }

}
