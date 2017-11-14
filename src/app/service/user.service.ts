import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {User} from "../model/user";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {AppConfig} from "../config/app.config";
import {Car} from "../model/car";

@Injectable()
export class UserService {

  private USERS_API_PREFIX = AppConfig.API_PREFIX + '/users';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  getCarsForUser(userId: number): Observable<Car[]> {
    return this.authHttp
      .get(this.USERS_API_PREFIX + '/' + userId + '/cars')
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getUserByEmail(email: string): Observable<User> {
    return this.authHttp
      .get(this.USERS_API_PREFIX + '?email=' + email)
      .map(res => res.json())
      .map(users => users[0])
      .catch(err => Observable.throw(err));
  }

  save(user: User): Observable<any> {
    let body = JSON.stringify(user);
    return this.http
      .post(this.USERS_API_PREFIX, body, this.OPTIONS)
      .catch(err => Observable.throw(err));
  }

}
