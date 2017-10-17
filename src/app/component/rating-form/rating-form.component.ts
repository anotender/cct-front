import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {RatingService} from "../../service/rating.service";
import {BsModalComponent} from "ng2-bs3-modal";
import {NgProgressService} from "ngx-progressbar";
import {NotificationsService} from "angular2-notifications/dist";
import {AuthService} from "../../service/auth.service";
import {Rating} from "../../model/rating";

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
              private progressService: NgProgressService,
              private notificationsService: NotificationsService) {
  }

  submitRatingForm(): void {
    this.progressService.start();
    this.ratingService
      .save({
        id: null,
        userId: this.authService.getCurrentUserId(),
        versionId: this.versionId,
        comment: this.comment,
        points: this.points,
        date: new Date().getTime()
      })
      .subscribe(rating => {
        this.ratingSaved.emit(rating);
        this.notificationsService.success('Added rating');
        this.close();
      }, err => {
        console.log(err);
        this.notificationsService.error('Something went wrong', 'Try again!');
        this.close();
      });
  }

  open(): void {
    this.modal.open();
  }

  private close(): void {
    this.progressService.done();
    this.modal.close();
    this.points = null;
    this.comment = null;
  }

}
