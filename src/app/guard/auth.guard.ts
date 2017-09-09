import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../service/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate() {
    if (this.authService.authenticated()) {
      return true;
    } else {
      this.authService.logout();
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
