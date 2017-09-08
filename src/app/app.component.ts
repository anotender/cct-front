import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public static API_PREFIX = 'http://localhost:8080/api';

  notificationsOptions = {
    timeOut: 2000,
    pauseOnHover: false,
    showProgressBar: false
  };
}
