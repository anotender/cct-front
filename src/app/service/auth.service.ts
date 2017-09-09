import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {AppComponent} from "../app.component";
import {Credentials} from "../model/credentials";
import {tokenNotExpired} from "angular2-jwt";
import {NotificationsService} from "angular2-notifications/dist";

@Injectable()
export class AuthService {
  private LOGIN_URI = AppComponent.API_PREFIX + '/login';

  constructor(private http: Http, private router: Router, private notificationsService: NotificationsService) {
  }

  login(credentials: Credentials): void {
    this.http
      .post(this.LOGIN_URI, JSON.stringify(credentials))
      .subscribe(
        response => {
          localStorage.setItem('token', response.headers.get('Authorization'));
          localStorage.setItem('email', credentials.username);
          this.router.navigateByUrl('/dashboard');
        },
        error => {
          console.log(error);
          this.notificationsService.error('Incorrect username or password');
        }
      );
  }

  authenticated() {
    return tokenNotExpired();
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

}
