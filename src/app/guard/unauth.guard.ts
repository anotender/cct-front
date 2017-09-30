import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../service/auth.service";

@Injectable()
export class UnauthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate() {
    if (this.authService.authenticated()) {
      this.router.navigateByUrl('/dashboard');
      return false;
    } else {
      return true;
    }
  }
}
