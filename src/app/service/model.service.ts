import {Injectable} from "@angular/core";
import {AppComponent} from "../app.component";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Version} from "../model/version";

@Injectable()
export class ModelService {

  private MODELS_API_PREFIX = AppComponent.API_PREFIX + '/models';

  constructor(private authHttp: AuthHttp) {
  }

  getVersionsForModel(modelId: string): Observable<Version[]> {
    return this.authHttp
      .get(this.MODELS_API_PREFIX + '/' + modelId + '/versions')
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
