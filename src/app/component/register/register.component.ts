import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../service/user.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {matchOtherValidator} from "@moebius/ng-validators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: FormControl;
  password: FormControl;
  confirmedPassword: FormControl;
  registerForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.confirmedPassword = new FormControl('', [Validators.required, matchOtherValidator('password')]);
    this.registerForm = this.fb.group({
      email: this.email,
      password: this.password,
      confirmedPassword: this.confirmedPassword
    });
  }

  register(value): void {
    this.userService
      .save(this.mapFormValueToUser(value))
      .subscribe(
        res => this.router.navigateByUrl('/login'),
        err => console.log(err)
      );
  }

  private mapFormValueToUser(value): User {
    let user: User = new User();

    user.email = value.email;
    user.password = value.password;

    return user;
  }

}
