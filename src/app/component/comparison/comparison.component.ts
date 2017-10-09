import {Component, OnInit} from '@angular/core';
import {Make} from "../../model/make";
import {MakeService} from "../../service/make.service";
import {NgProgressService} from "ngx-progressbar";
import {Model} from "../../model/model";
import {Version} from "../../model/version";
import {ModelService} from "../../service/model.service";
import {Router} from "@angular/router";

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
              private progressService: NgProgressService,
              private router: Router) {
  }

  ngOnInit() {
    this.progressService.start();
    this.makeService
      .getMakes()
      .subscribe(
        makes => this.makes = makes,
        err => console.log(err),
        () => this.progressService.done()
      );
  }

  addToComparison(): void {
    this.carsToCompare.push({
      'make': this.selectedMake,
      'model': this.selectedModel,
      'version': this.selectedVersion
    });

    this.selectedMake = null;
    this.selectedModel = null;
    this.selectedVersion = null;
    this.models.length = 0;
    this.versions.length = 0;
    console.log(this.carsToCompare);
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
      .subscribe(
        models => this.models = models,
        err => console.log(err),
        () => this.progressService.done()
      );
  }

  onModelChange(model: Model): void {
    this.progressService.start();
    this.selectedModel = model;
    this.selectedVersion = null;
    this.versions.length = 0;
    this.modelService
      .getVersionsForModel(model.id)
      .subscribe(
        versions => this.versions = versions,
        err => console.log(err),
        () => this.progressService.done()
      );
  }

  showCarInfo(id: string): void {
    this.router.navigate(['/cars', id]);
  }

}
