import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
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
    this.authService.login({
      username: value.email,
      password: value.password
    });
  }

  register(): void {
    this.router.navigateByUrl('/register');
  }

  forgotPassword(): void {
    this.router.navigateByUrl('/password');
  }

}
