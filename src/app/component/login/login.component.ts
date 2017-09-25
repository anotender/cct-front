import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgProgressService} from "ngx-progressbar";
import {NotificationsService} from "angular2-notifications/dist";

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

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private notificationsService: NotificationsService,
              private progressService: NgProgressService) {
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
    this.progressService.start();
    this.loginButtonDisabled = true;
    this.authService
      .login({
        username: value.email,
        password: value.password
      })
      .subscribe(
        response => {
          localStorage.setItem('token', response.headers.get('Authorization'));
          localStorage.setItem('email', value.email);
          this.router.navigateByUrl('/dashboard');
          this.progressService.done();
          this.loginButtonDisabled = false;
        },
        error => {
          console.log(error);
          this.notificationsService.error('Incorrect username or password');
          this.progressService.done();
          this.loginButtonDisabled = false;
        }
      );
  }

  register(): void {
    this.router.navigateByUrl('/register');
  }

  forgotPassword(): void {
    this.router.navigateByUrl('/password');
  }

}
