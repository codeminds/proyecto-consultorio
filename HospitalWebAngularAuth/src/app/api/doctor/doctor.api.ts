import { Injectable } from '@angular/core';
import { APIResponse, QueryParams } from '@services/http/http.types';
import { HttpService } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { InsertUpdateDoctorDTO } from './doctor.dto';
import { Doctor } from './doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorApi{
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'doctors';
  }

  public list(filter: QueryParams): Observable<APIResponse<Doctor[]>> {
    return this.httpService.get(this._api, { params: filter, accessToken: true }).mapArrayResponse((item: object) => new Doctor(item));
  }

  public search(values: string[]): Observable<APIResponse<Doctor[]>> {
    return this.httpService.get(`${this._api}/search`, { params: { s: values }, accessToken: true }).mapArrayResponse((item: object) => new Doctor(item));
  }

  public get(id: number): Observable<APIResponse<Doctor>> {
    return this.httpService.get(`${this._api}/${id}`, { accessToken: true }).mapObjectResponse((item: object) => new Doctor(item));
  }

  public post(data: Doctor): Observable<APIResponse<Doctor>> {
    return this.httpService.post(this._api, new InsertUpdateDoctorDTO(data), { accessToken: true }).mapObjectResponse((item: object) => new Doctor(item));
  }

  public put(id: number, data: Doctor): Observable<APIResponse<Doctor>> {
    return this.httpService.put(`${this._api}/${id}`, new InsertUpdateDoctorDTO(data), { accessToken: true }).mapObjectResponse((item: object) => new Doctor(item));
  }

  public delete(id: number): Observable<APIResponse<Doctor>> {
    return this.httpService.delete(`${this._api}/${id}`, { accessToken: true }).mapObjectResponse((item: object) => new Doctor(item));
  }
}
