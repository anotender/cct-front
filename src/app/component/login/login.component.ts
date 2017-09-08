import {Component} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Credentials} from "../../model/credentials";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public credentials: Credentials = new Credentials();

  constructor(private authService: AuthService, private router: Router) {
  }

  login(): void {
    this.authService.login(this.credentials);
  }

  register(): void {
    this.router.navigateByUrl('/register');
  }

  forgotPassword(): void {
    console.log('forgot password...');
  }

}
