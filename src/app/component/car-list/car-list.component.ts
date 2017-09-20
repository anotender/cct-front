import {Component, OnInit} from '@angular/core';
import {MakeService} from "../../service/make.service";
import {Make} from "../../model/make";
import {Model} from "../../model/model";
import {ModelService} from "../../service/model.service";
import {Version} from "../../model/version";
import {VersionService} from "../../service/version.service";
import {NgProgressService} from "ng2-progressbar";

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
  selectedVersion: Version = null;
  makeFilterString: string = '';
  modelFilterString: string = '';

  constructor(private makeService: MakeService,
              private modelService: ModelService,
              private versionService: VersionService,
              private progressService: NgProgressService) {
  }

  ngOnInit() {
    this.progressService.start();
    this.makeService
      .getMakes()
      .subscribe(data => {
        this.makes = data;
        this.progressService.done();
      });
  }

  selectMake(make: Make): void {
    if (make === this.selectedMake) return;

    this.progressService.start();
    this.selectedMake = make;
    this.selectedModel = null;
    this.selectedVersion = null;
    this.modelFilterString = '';
    this.models.length = 0;
    this.versions = {};
    this.makeService
      .getModelsForMake(make.id)
      .subscribe(data => {
        this.models = data;
        this.progressService.done();
      });
  }

  selectModel(model: Model): void {
    if (model === this.selectedModel) return;

    this.progressService.start();
    this.selectedModel = model;
    this.selectedVersion = null;
    this.versions = {};
    this.modelService
      .getVersionsForModel(model.id)
      .subscribe(data => {
        this.versions = this.groupVersions(data);
        this.progressService.done();
      });
  }

  selectVersion(version: Version): void {
    if (this.selectedVersion && version.id === this.selectedVersion.id) return;

    this.progressService.start();
    this.selectedVersion = version;
    this.versionService
      .getVersion(version.id)
      .subscribe(data => {
        this.selectedVersion = data;
        this.progressService.done();
      });
  }

  getYears(): string[] {
    return Object.keys(this.versions);
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
