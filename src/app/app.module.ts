import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavbarComponent} from './component/navbar/navbar.component';
import {LoginComponent} from './component/login/login.component';
import {RouterModule, Routes} from "@angular/router";
import {AuthService} from "./service/auth.service";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {Http, HttpModule, RequestOptions} from "@angular/http";
import {FormsModule} from "@angular/forms";

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '**', component: AppComponent}
];

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
