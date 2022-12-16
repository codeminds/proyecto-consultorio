import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse } from '@services/http/http.types';
import { Observable } from 'rxjs';
import { Field } from './field.model';

@Injectable({
  providedIn: 'root'
})
export class FieldApi {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) { 
    this._api = "fields";
  }

  public list(): Observable<APIResponse<Field[]>> {
    return this.httpService.get(this._api, { accessToken: true }).mapArrayResponse((item: object) => new Field(item));
  }
}
