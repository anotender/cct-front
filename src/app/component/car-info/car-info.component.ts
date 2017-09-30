import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Make} from "../../model/make";
import {Version} from "../../model/version";
import {Model} from "../../model/model";
import {NgProgressService} from "ngx-progressbar";
import {VersionService} from "../../service/version.service";
import {ModelService} from "../../service/model.service";
import {MakeService} from "../../service/make.service";
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {AuthService} from "../../service/auth.service";
import {CarService} from "../../service/car.service";
import {NotificationsService} from "angular2-notifications/dist";

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
              private makeService: MakeService,
              private authService: AuthService,
              private carService: CarService,
              private notificationsService: NotificationsService,
              private modal: Modal) {
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

  addToMyCars(): void {
    this.modal
      .prompt()
      .showClose(false)
      .title('Adding ' + this.selectedMake.name + ' ' + this.selectedModel.name + ' ' + this.selectedVersion.name + ' to your cars')
      .placeholder('Car name')
      .open()
      .then(dialogRef => {
        dialogRef.result.then(name => {
          this.progressService.start();
          this.authService
            .getCurrentUser()
            .subscribe(user => this.carService
              .save({
                id: null,
                name: name,
                versionId: this.selectedVersion.id,
                userId: user.id
              })
              .subscribe(res => {
                this.progressService.done();
                this.notificationsService.success('Car "' + name + '" has just been added to your cars!');
              })
            );
        });
      });
  }

}
