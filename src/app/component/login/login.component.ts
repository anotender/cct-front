import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgProgress} from "ngx-progressbar";
import {UserService} from "../../service/user.service";
import {CustomErrorHandler} from "../../config/error.handler";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;
  loginButtonDisabled: boolean = false;

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private progress: NgProgress,
              private errorHandler: CustomErrorHandler) {
  }

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password
    });
  }

  login(value): void {
    this.progress.start();
    this.loginButtonDisabled = true;
    this.authService
      .login({
        username: value.email,
        password: value.password
      })
      .subscribe(response => {
        localStorage.setItem('token', response.headers.get('Authorization'));
        localStorage.setItem('email', value.email);
        this.userService
          .getUserByEmail(value.email)
          .subscribe(user => {
            localStorage.setItem('id', user.id.toString());
            this.router.navigateByUrl('/dashboard');
            this.progress.done();
            this.loginButtonDisabled = false;
          });
      }, err => {
        this.errorHandler.handleError(err);
        this.loginButtonDisabled = false;
      });
  }

  register(): void {
    this.router.navigateByUrl('/register');
  }

  forgotPassword(): void {
    this.router.navigateByUrl('/password');
  }

}
