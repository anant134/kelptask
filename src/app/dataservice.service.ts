import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { finalize, map } from 'rxjs';

declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class DataserviceService {
  httpOptions: object | undefined;
  constructor(private http: HttpClient, private rounter: Router) {}
  public getHttp(reqURL: string, objData: any) {
    const params = $.param(objData);
    return this.http
      .get(environment.api_root + reqURL + params, this.httpOptions)
      .pipe(
        map((x: any) => {
          if (x && x.errorCode && x.errorCode == 401) {
            return x;
          }

          return x;
        })
      )
      .pipe(finalize(() => {}));
  }
}
