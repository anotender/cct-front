import {Component, OnInit} from '@angular/core';
import {MakeService} from "../../service/make.service";
import {Make} from "../../model/make";
import {Model} from "../../model/model";
import {ModelService} from "../../service/model.service";
import {Version} from "../../model/version";

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  makes: Make[] = [];
  models: Model[] = [];
  versions: Version[] = [];
  selectedMake: Make = new Make();
  selectedModel: Model = new Model();

  constructor(private makeService: MakeService, private modelService: ModelService) {
  }

  ngOnInit() {
    this.makeService
      .getMakes()
      .subscribe(data => this.makes = data);
  }

  selectMake(make: Make): void {
    this.selectedMake = make;
    this.makeService
      .getModelsForMake(make.id)
      .subscribe(data => this.models = data);
  }

  selectModel(model: Model): void {
    this.selectedModel = model;
    this.modelService
      .getVersionsForModel(model.id)
      .subscribe(data => this.versions = data);
  }

}
