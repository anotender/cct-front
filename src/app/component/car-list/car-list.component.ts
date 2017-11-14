import {Component, OnInit} from '@angular/core';
import {MakeService} from "../../service/make.service";
import {Make} from "../../model/make";
import {Model} from "../../model/model";
import {ModelService} from "../../service/model.service";
import {Version} from "../../model/version";
import {NgProgress} from "ngx-progressbar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  makes: Make[] = [];
  models: Model[] = [];
  versions: any = {};
  selectedMake: Make = null;
  selectedModel: Model = null;
  makeFilterString: string = '';
  modelFilterString: string = '';

  constructor(private makeService: MakeService,
              private modelService: ModelService,
              private progress: NgProgress,
              private router: Router) {
  }

  ngOnInit() {
    this.progress.start();
    this.makeService
      .getMakes()
      .subscribe(data => {
        this.makes = data;
        this.progress.done();
      });
  }

  selectMake(make: Make): void {
    if (make === this.selectedMake) return;

    this.progress.start();
    this.selectedMake = make;
    this.selectedModel = null;
    this.modelFilterString = '';
    this.models.length = 0;
    this.versions = {};
    this.makeService
      .getModelsForMake(make.id)
      .subscribe(data => {
        this.models = data;
        this.progress.done();
      });
  }

  selectModel(model: Model): void {
    if (model === this.selectedModel) return;

    this.progress.start();
    this.selectedModel = model;
    this.versions = {};
    this.modelService
      .getVersionsForModel(model.id)
      .subscribe(data => {
        this.versions = this.groupVersions(data);
        this.progress.done();
      });
  }

  getYears(): string[] {
    return Object.keys(this.versions);
  }

  showCarInfo(id: string): void {
    this.router.navigate(['/cars', id]);
  }

  private groupVersions(versions: Version[]): any {
    let groupedVersions: any = {};

    versions.forEach(v => {
      if (!groupedVersions[v.years]) {
        groupedVersions[v.years] = [];
      }
      groupedVersions[v.years].push(v);
    });

    return groupedVersions;
  }

}
