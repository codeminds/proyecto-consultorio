import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse } from '@services/http/http.types';
import { Observable } from 'rxjs';
import { Status } from './status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusApi {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) { 
    this._api = "statusses";
  }

  public list(): Observable<APIResponse<Status[]>> {
    return this.httpService.get(this._api, { accessToken: true }).mapArrayResponse((item: object) => new Status(item));;
  }
}