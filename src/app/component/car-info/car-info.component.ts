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
import {Rating} from "../../model/rating";
import {Observable} from "rxjs/Observable";
import {RatingService} from "../../service/rating.service";

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})
export class CarInfoComponent implements OnInit {

  selectedMake: Make = new Make();
  selectedModel: Model = new Model();
  selectedVersion: Version = new Version();
  ratings: Rating[] = [];
  points: number;
  comment: string = '';

  constructor(private route: ActivatedRoute,
              private progressService: NgProgressService,
              private versionService: VersionService,
              private modelService: ModelService,
              private makeService: MakeService,
              private authService: AuthService,
              private carService: CarService,
              private ratingService: RatingService,
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
          Observable.forkJoin(
            this.makeService.getMake(model.makeId),
            this.versionService.getRatingsForVersion(params['id'])
          ).subscribe(
            res => {
              this.selectedMake = res[0];
              this.ratings = res[1];
            },
            err => console.log(err),
            () => this.progressService.done()
          );
        });
      });
    });
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
          this.carService
            .save({
              id: null,
              name: name,
              versionId: this.selectedVersion.id,
              userId: this.authService.getCurrentUserId()
            })
            .subscribe(
              res => this.notificationsService.success('Car "' + name + '" has just been added to your cars!'),
              err => {
                console.log(err);
                this.notificationsService.error('Something has gone wrong', 'Try again!');
              },
              () => this.progressService.done()
            );
        });
      });
  }

  addRating(): void {
    this.progressService.start();
    this.ratingService
      .save({
        id: null,
        userId: this.authService.getCurrentUserId(),
        versionId: this.selectedVersion.id,
        comment: this.comment,
        points: this.points,
        date: new Date()
      })
      .subscribe(
        rating => {
          console.log(rating);
          this.ratings.push(rating);
          this.notificationsService.success('Added rating');
        },
        err => {
          console.log(err);
          this.notificationsService.error('Something has gone wrong', 'Try again!');
        },
        () => this.progressService.done());
  }

  prepareFuelConsumption(n: number): string {
    return `${this.isDataProvided(n) ? n : 'No data'}`;
  }

  private isDataProvided(n: number): boolean {
    return n && n != null && n !== 0;
  }

}
