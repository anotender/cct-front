import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {AppComponent} from "../app.component";
import {Credentials} from "../model/credentials";

@Injectable()
export class AuthService {
  private LOGIN_URI = AppComponent.API_PREFIX + '/login';

  constructor(private http: Http, private router: Router) {
  }

  login(credentials: Credentials): void {
    this.http
      .post(this.LOGIN_URI, JSON.stringify(credentials))
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

}
