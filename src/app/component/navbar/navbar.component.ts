import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authService: AuthService) {
  }

  logout(): void {
    this.authService.logout();
  }

  authenticated(): boolean {
    return this.authService.authenticated();
  }

  getCurrentUserEmail(): string {
    return localStorage.getItem('email');
  }

}
