import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Make} from "../../model/make";
import {Version} from "../../model/version";
import {Model} from "../../model/model";
import {NgProgressService} from "ngx-progressbar";
import {VersionService} from "../../service/version.service";
import {ModelService} from "../../service/model.service";
import {MakeService} from "../../service/make.service";

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})
export class CarInfoComponent implements OnInit {

  selectedMake: Make = new Make();
  selectedModel: Model = new Model();
  selectedVersion: Version = new Version();

  constructor(private route: ActivatedRoute,
              private progressService: NgProgressService,
              private versionService: VersionService,
              private modelService: ModelService,
              private makeService: MakeService) {
  }

  ngOnInit() {
    this.progressService.start();
    this.route.params.subscribe(params => {
      this.versionService.getVersion(params['id']).subscribe(version => {
        this.selectedVersion = version;
        this.modelService.getModel(version.modelId).subscribe(model => {
          this.selectedModel = model;
          this.makeService.getMake(model.makeId).subscribe(make => {
            this.selectedMake = make;
            this.progressService.done();
          });
        });
      });
    });
  }

  isDataProvided(n: number): boolean {
    return n && n != null && n !== 0;
  }

}
