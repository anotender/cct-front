import {Injectable} from "@angular/core";
import {Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Rating} from "../model/rating";
import {AppConfig} from "../config/app.config";
import {NumberUtils} from "../util/number.utils";

@Injectable()
export class RatingService {

  private RATINGS_API_PREFIX = AppConfig.API_PREFIX + '/ratings';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private authHttp: AuthHttp) {
  }

  save(rating: Rating): Observable<any> {
    let body = JSON.stringify(rating);
    return this.authHttp
      .post(this.RATINGS_API_PREFIX, body, this.OPTIONS)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  countAverageRating(ratings: Rating[]): number {
    return NumberUtils.countAverage(ratings.map(r => r.points));
  }

}
