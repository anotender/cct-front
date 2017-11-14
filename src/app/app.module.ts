import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
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
import {AuthGuard} from "./guard/auth.guard";
import {CarListComponent} from './component/car-list/car-list.component';
import {MakeService} from "./service/make.service";
import {ModelService} from "./service/model.service";
import {MakeFilterPipe} from "./pipe/make-filter.pipe";
import {ModelFilterPipe} from "./pipe/model-filter.pipe";
import {VersionService} from "./service/version.service";
import {NgProgressModule} from "ngx-progressbar";
import {CarInfoComponent} from './component/car-info/car-info.component';
import {UnauthGuard} from "./guard/unauth.guard";
import {CarService} from "./service/car.service";
import {BootstrapModalModule} from "ngx-modialog/plugins/bootstrap";
import {ModalModule} from "ngx-modialog";
import {ComparisonComponent} from './component/comparison/comparison.component';
import {RatingService} from "./service/rating.service";
import {BsModalModule} from "ng2-bs3-modal";
import {RatingFormComponent} from './component/rating-form/rating-form.component';
import {AgmCoreModule} from '@agm/core';
import {FuelStationsMapComponent} from './component/fuel-stations-map/fuel-stations-map.component';
import {AppConfig} from "./config/app.config";
import {FuelStationService} from "./service/fuel-station.service";
import {ToastrModule} from "ngx-toastr";
import {CustomErrorHandler} from "./config/error.handler";

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [UnauthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [UnauthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'compare', component: ComparisonComponent, canActivate: [AuthGuard]},
  {path: 'cars', component: CarListComponent, canActivate: [AuthGuard]},
  {path: 'cars/:id', component: CarInfoComponent, canActivate: [AuthGuard]},
  {path: 'fuel-stations-map', component: FuelStationsMapComponent, canActivate: [AuthGuard]},
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
    ModelFilterPipe,
    CarInfoComponent,
    ComparisonComponent,
    RatingFormComponent,
    FuelStationsMapComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgProgressModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    BsModalModule,
    AgmCoreModule.forRoot({
      apiKey: AppConfig.GOOGLE_API_KEY
    }),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ],
  providers: [
    UserService,
    MakeService,
    ModelService,
    VersionService,
    CarService,
    RatingService,
    FuelStationService,
    AuthService,
    AuthGuard,
    UnauthGuard,
    CustomErrorHandler,
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
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
