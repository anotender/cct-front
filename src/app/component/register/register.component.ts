import {Component} from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: User = new User();
  confirmedPassword: string = '';

  constructor(private userService: UserService) {
  }

  register(): void {
    this.userService
      .save(this.user)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );
  }

}
