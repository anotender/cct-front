import {Component, OnInit, ViewChild} from '@angular/core';
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
import {StringUtils} from "../../util/string.utils";
import {RatingFormComponent} from "../rating-form/rating-form.component";
import {RatingService} from "../../service/rating.service";

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})
export class CarInfoComponent implements OnInit {

  @ViewChild('ratingFormModal')
  ratingFormModal: RatingFormComponent;

  selectedMake: Make = new Make();
  selectedModel: Model = new Model();
  selectedVersion: Version = new Version();
  ratings: Rating[] = [];
  averageRating: number;

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
          ).subscribe(res => {
            this.selectedMake = res[0];
            this.ratings = res[1];
            this.averageRating = this.ratingService.countAverageRating(this.ratings);
            this.progressService.done()
          }, err => {
            console.log(err);
            this.progressService.done();
          });
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
              .subscribe(res => {
                this.notificationsService.success('Car "' + name + '" has just been added to your cars!');
                this.progressService.done();
              }, err => {
                console.log(err);
                this.notificationsService.error('Something has gone wrong', 'Try again!');
                this.progressService.done();
              });
          });
        }
      );
  }

  handleRatingSaved(rating: Rating): void {
    this.ratings.push(rating);
    this.averageRating = this.ratingService.countAverageRating(this.ratings);
  }

  prepareNumberData(n: number): string {
    return `${this.isDataProvided(n) ? Number(n).toFixed(2) : 'No data'}`;
  }

  prepareStringData(s: string): string {
    return StringUtils.isNotEmpty(s) ? s : 'No comment';
  }

  prepareDate(millis: number): string {
    return new Date(millis).toLocaleDateString();
  }

  private isDataProvided(n: number): boolean {
    return n && n != null && n !== 0;
  }

}
