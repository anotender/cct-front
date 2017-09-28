import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {NgProgressService} from "ngx-progressbar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static API_PREFIX = 'http://localhost:8080/api';

  notificationsOptions = {
    timeOut: 2000,
    pauseOnHover: false,
    showProgressBar: false
  };

  constructor(private router: Router, private progressService: NgProgressService) {
  }

  ngOnInit(): void {
    this.router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        this.progressService.start();
      } else {
        this.progressService.done();
      }
    });
  }
}
