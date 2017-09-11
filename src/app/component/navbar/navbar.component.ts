import {Component} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) {
  }

  logout(): void {
    this.authService.logout();
  }

  showCars(): void {
    this.router.navigateByUrl('/cars');
  }

  showFuelStations(): void {
    this.router.navigateByUrl('/fuelstations');
  }

  authenticated(): boolean {
    return this.authService.authenticated();
  }

  getCurrentUserEmail(): string {
    return localStorage.getItem('email');
  }

}
