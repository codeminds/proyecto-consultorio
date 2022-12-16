import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse } from '@services/http/http.types';
import { Observable } from 'rxjs';
import { Gender } from './gender.model';

@Injectable({
  providedIn: 'root'
})
export class GenderApi {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) { 
    this._api = "genders";
  }

  public list(): Observable<APIResponse<Gender[]>> {
    return this.httpService.get(this._api, { accessToken: true }).mapArrayResponse((item: object) => new Gender(item));;
  }
}
