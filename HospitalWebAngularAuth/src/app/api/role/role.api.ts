import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse } from '@services/http/http.types';
import { Observable } from 'rxjs';
import { Role } from './role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleApi {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) { 
    this._api = "roles";
  }

  public list(): Observable<APIResponse<Role[]>> {
    return this.httpService.get(this._api, { accessToken: true }).mapArrayResponse((item: object) => new Role(item));;
  }
}
