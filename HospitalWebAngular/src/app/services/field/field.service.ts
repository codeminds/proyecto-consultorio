import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse } from '@services/http/http.types';
import { map, Observable, tap } from 'rxjs';
import { Field } from './field.model';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) { 
    this._api = "fields";
  }

  public list(): Observable<Field[]> {
    return this.httpService.get(this._api)
      .pipe<Field[]>(
        map((response: APIResponse) => response?.data.map((item: any) => new Field(item)))
      );
  }
}
