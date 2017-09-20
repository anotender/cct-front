import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {Http, HttpModule, RequestOptions} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {AppComponent} from './app.component';
import {NavbarComponent} from './component/navbar/navbar.component';
import {LoginComponent} from './component/login/login.component';
import {RegisterComponent} from './component/register/register.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {AuthService} from "./service/auth.service";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {UserService} from "./service/user.service";
import {SimpleNotificationsModule} from "angular2-notifications";
import {AuthGuard} from "./guard/auth.guard";
import {CarListComponent} from './component/car-list/car-list.component';
import {MakeService} from "./service/make.service";
import {ModelService} from "./service/model.service";
import {MakeFilterPipe} from "./pipe/make-filter.pipe";
import {ModelFilterPipe} from "./pipe/model-filter.pipe";
import {VersionService} from "./service/version.service";
import {NgProgressModule} from "ng2-progressbar";

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'cars', component: CarListComponent, canActivate: [AuthGuard]},
  {path: '**', component: DashboardComponent, canActivate: [AuthGuard]}
];

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  let authConfig: AuthConfig = new AuthConfig({
    tokenName: 'token',
    tokenGetter: () => localStorage.getItem('token')
  });
  return new AuthHttp(authConfig, http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CarListComponent,
    MakeFilterPipe,
    ModelFilterPipe
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgProgressModule
  ],
  providers: [
    UserService,
    MakeService,
    ModelService,
    VersionService,
    AuthService,
    AuthGuard,
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
