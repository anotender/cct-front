import {Component} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Credentials} from "../../model/credentials";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public credentials: Credentials = new Credentials();

  constructor(private authService: AuthService) {
  }

  public login() {
    this.authService.login(this.credentials);
  }

}
