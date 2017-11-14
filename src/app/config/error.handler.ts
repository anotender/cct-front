import {ErrorHandler, Injectable, Injector} from "@angular/core";
import {NgProgress} from "ngx-progressbar";
import {ToastrService} from "ngx-toastr";
import {StringUtils} from "../util/string.utils";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  private toastr: ToastrService;

  constructor(private progress: NgProgress, private injector: Injector) {
    //FIXME it needs to be changed
    setTimeout(() => this.toastr = injector.get(ToastrService));
  }

  handleError(err: any, message?: string): void {
    if (err.status === 401) {
      this.toastr.error('Incorrect username or password');
    } else if (StringUtils.isNotEmpty(message)) {
      this.toastr.error(message);
    } else if (StringUtils.isNotEmpty(err._body)) {
      this.toastr.error(JSON.parse(err._body).message);
    } else {
      this.toastr.error('Unknown error');
    }

    console.log(err);
    this.progress.done();
  }

}
