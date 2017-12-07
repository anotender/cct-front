import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Make} from "../../model/make";
import {Version} from "../../model/version";
import {Model} from "../../model/model";
import {NgProgress} from "ngx-progressbar";
import {VersionService} from "../../service/version.service";
import {ModelService} from "../../service/model.service";
import {MakeService} from "../../service/make.service";
import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {AuthService} from "../../service/auth.service";
import {CarService} from "../../service/car.service";
import {Rating} from "../../model/rating";
import {Observable} from "rxjs/Observable";
import {StringUtils} from "../../util/string.utils";
import {RatingFormComponent} from "../rating-form/rating-form.component";
import {RatingService} from "../../service/rating.service";
import {ToastrService} from "ngx-toastr";
import {DateUtils} from "../../util/date.utils";
import {NumberUtils} from "../../util/number.utils";
import {FuelUtils} from "../../util/fuel.utils";

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
  formatNumber: (n: number, fractionDigits: number) => string = NumberUtils.formatNumber;
  formatFuel: (fuel: string) => string = FuelUtils.getTextForFuel;
  formatDate: (millis: number) => string = DateUtils.formatDate;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private progress: NgProgress,
              private versionService: VersionService,
              private modelService: ModelService,
              private makeService: MakeService,
              private authService: AuthService,
              private carService: CarService,
              private ratingService: RatingService,
              private modal: Modal,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.progress.start();
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
            this.progress.done()
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
      .then(dialogRef => dialogRef.result.then(name => {
        this.progress.start();
        this.carService
          .save({
            id: null,
            name: name,
            versionId: this.selectedVersion.id,
            userId: this.authService.getCurrentUserId()
          })
          .subscribe(res => {
            this.toastr.success('Car "' + name + '" has just been added to your cars!');
            this.router.navigateByUrl('/users/' + this.authService.getCurrentUserId() + '/cars');
            this.progress.done();
          });
      }), ignored => {
      });
  }

  handleRatingSaved(rating: Rating): void {
    this.ratings.push(rating);
    this.averageRating = this.ratingService.countAverageRating(this.ratings);
  }

  formatComment(s: string): string {
    return StringUtils.isNotEmpty(s) ? s : 'No comment';
  }

}
