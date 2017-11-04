import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Router} from "@angular/router";
import {Credentials} from "../model/credentials";
import {tokenNotExpired} from "angular2-jwt";
import {Observable} from "rxjs/Observable";
import {AppConfig} from "../config/app.config";

@Injectable()
export class AuthService {
  private LOGIN_URI = AppConfig.API_PREFIX + '/login';

  constructor(private http: Http, private router: Router) {
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

  getCurrentUserId(): number {
    return Number(localStorage.getItem('id'));
  }

}
