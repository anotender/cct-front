import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RatingService} from "../../service/rating.service";
import {BsModalComponent} from "ng2-bs3-modal";
import {NgProgress} from "ngx-progressbar";
import {AuthService} from "../../service/auth.service";
import {Rating} from "../../model/rating";
import {ToastrService} from "ngx-toastr";
import {DateUtils} from "../../util/date.utils";

@Component({
  selector: 'app-rating-form',
  templateUrl: './rating-form.component.html',
  styleUrls: ['./rating-form.component.css']
})
export class RatingFormComponent {

  @ViewChild('modal')
  modal: BsModalComponent;

  @Input('versionId') versionId: string;
  @Output() ratingSaved: EventEmitter<Rating> = new EventEmitter<Rating>();

  points: number;
  comment: string = '';

  constructor(private ratingService: RatingService,
              private authService: AuthService,
              private progress: NgProgress,
              private toastr: ToastrService) {
  }

  submitRatingForm(): void {
    this.progress.start();
    this.ratingService
      .save({
        id: null,
        userId: this.authService.getCurrentUserId(),
        versionId: this.versionId,
        comment: this.comment,
        points: this.points,
        date: DateUtils.getCurrentTimeInMillis()
      })
      .subscribe(rating => {
        this.ratingSaved.emit(rating);
        this.toastr.success('Added rating');
        this.progress.done();
        this.close();
      });
  }

  open(): void {
    this.modal.open();
  }

  private close(): void {
    this.progress.done();
    this.modal.close();
    this.points = null;
    this.comment = null;
  }

}
