import {Component, OnInit} from '@angular/core';
import {MakeService} from "../../service/make.service";
import {Make} from "../../model/make";
import {Model} from "../../model/model";
import {ModelService} from "../../service/model.service";
import {Version} from "../../model/version";
import {VersionService} from "../../service/version.service";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  makes: Make[] = [];
  models: Model[] = [];
  versions: Version[] = [];
  selectedMake: Make = null;
  selectedModel: Model = null;
  selectedVersion: Version = null;
  makeFilterString: string = '';
  modelFilterString: string = '';
  versionFilterString: string = '';

  constructor(private makeService: MakeService, private modelService: ModelService, private versionService: VersionService) {
  }

  ngOnInit() {
    this.makeService
      .getMakes()
      .subscribe(data => this.makes = data);
  }

  selectMake(make: Make): void {
    this.selectedMake = make;
    this.selectedModel = null;
    this.selectedVersion = null;
    this.models.length = 0;
    this.versions.length = 0;
    this.makeService
      .getModelsForMake(make.id)
      .subscribe(data => this.models = data);
  }

  selectModel(model: Model): void {
    this.selectedModel = model;
    this.selectedVersion = null;
    this.versions.length = 0;
    this.modelService
      .getVersionsForModel(model.id)
      .subscribe(data => this.versions = data);
  }

  selectVersion(version: Version): void {
    this.selectedVersion = version;
    this.versionService
      .getVersion(version.id)
      .subscribe(data => this.selectedVersion = data);
  }

}
