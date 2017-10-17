import {Injectable} from "@angular/core";
import {Headers, RequestOptions} from "@angular/http";
import {AppComponent} from "../app.component";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Rating} from "../model/rating";

@Injectable()
export class RatingService {

  private RATINGS_API_PREFIX = AppComponent.API_PREFIX + '/ratings';
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
    let sum: number = ratings.map(r => r.points).reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  }

}
