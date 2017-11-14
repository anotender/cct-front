import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {NgProgress} from "ngx-progressbar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private progress: NgProgress) {
  }

  ngOnInit(): void {
    this.router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        this.progress.start();
      } else {
        this.progress.done();
      }
    });
  }
}
