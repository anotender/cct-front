import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {AuthHttp} from "angular2-jwt";
import {Version} from "../model/version";
import {Model} from "../model/model";
import {AppConfig} from "../config/app.config";

@Injectable()
export class ModelService {

  private MODELS_API_PREFIX = AppConfig.API_PREFIX + '/models';

  constructor(private authHttp: AuthHttp) {
  }

  getModel(modelId: string): Observable<Model> {
    return this.authHttp
      .get(this.MODELS_API_PREFIX + '/' + modelId)
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getModelsForIds(ids: string[]): Observable<Model[]> {
    return this.authHttp
      .get(this.MODELS_API_PREFIX + '?id=' + ids.join())
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

  getVersionsForModel(modelId: string): Observable<Version[]> {
    return this.authHttp
      .get(this.MODELS_API_PREFIX + '/' + modelId + '/versions')
      .map(res => res.json())
      .catch(err => Observable.throw(err));
  }

}
