import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Router} from "@angular/router";
import {AppComponent} from "../app.component";
import {Credentials} from "../model/credentials";
import {AuthHttp, tokenNotExpired} from "angular2-jwt";
import {Observable} from "rxjs/Observable";
import {User} from "../model/user";
import {UserService} from "./user.service";

@Injectable()
export class AuthService {
  private LOGIN_URI = AppComponent.API_PREFIX + '/login';

  constructor(private http: Http, private userService: UserService, private router: Router) {
  }

  login(credentials: Credentials): Observable<Response> {
    return this.http.post(this.LOGIN_URI, JSON.stringify(credentials));
  }

  authenticated(): boolean {
    return tokenNotExpired();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  getCurrentUserEmail(): string {
    return localStorage.getItem('email');
  }

  getCurrentUser(): Observable<User> {
    return this.userService.getUserByEmail(this.getCurrentUserEmail());
  }

}
