import {Component, OnInit} from '@angular/core';
import {MakeService} from "../../service/make.service";
import {Make} from "../../model/make";
import {Model} from "../../model/model";
import {ModelService} from "../../service/model.service";
import {Version} from "../../model/version";
import {NgProgressService} from "ngx-progressbar";
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
              private progressService: NgProgressService,
              private router: Router) {
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
    this.versions = {};
    this.modelService
      .getVersionsForModel(model.id)
      .subscribe(data => {
        this.versions = this.groupVersions(data);
        this.progressService.done();
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
