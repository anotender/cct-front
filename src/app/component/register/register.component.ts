import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../service/user.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {matchOtherValidator} from "@moebius/ng-validators";
import {Router} from "@angular/router";
import {NotificationsService} from "angular2-notifications/dist";
import {NgProgressService} from "ngx-progressbar";

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
  registerButtonDisabled: boolean = false;

  constructor(private userService: UserService,
              private notificationsService: NotificationsService,
              private fb: FormBuilder,
              private progressService: NgProgressService,
              private router: Router) {
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
    this.registerButtonDisabled = true;
    this.progressService.start();

    let user: User = new User();
    user.email = value.email;
    user.password = value.password;

    this.userService
      .save(user)
      .subscribe(
        res => {
          this.progressService.done();
          this.registerButtonDisabled = false;
          this.notificationsService.success('User ' + value.email + ' created!', 'You can now sign in');
          this.router.navigateByUrl('/login');
        },
        err => {
          this.progressService.done();
          this.registerButtonDisabled = false;
          this.notificationsService.error('Cannot create user ' + value.email)
        }
      );
  }

}
