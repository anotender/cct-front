import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {AppComponent} from "../app.component";
import {User} from "../model/user";
import {Observable} from "rxjs/Rx";

@Injectable()
export class UserService {

  private API_PREFIX = AppComponent.API_PREFIX + '/users';
  private HEADERS = new Headers({'Content-Type': 'application/json'});
  private OPTIONS = new RequestOptions({headers: this.HEADERS});

  constructor(private http: Http) {
  }

  save(user: User): Observable<any> {
    let body = JSON.stringify(user);
    return this.http
      .post(this.API_PREFIX, body, this.OPTIONS)
      .catch(err => Observable.throw(err));
  }

}
