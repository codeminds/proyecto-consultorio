import { Injectable } from '@angular/core';
import { APIResponse, QueryParams } from '@services/http/http.types';
import { HttpService } from '@services/http/http.service';
import { map, Observable } from 'rxjs';
import { CreateUpdateDoctorDTO } from './doctor.dto';
import { Doctor } from './doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService{
  private _api: Readonly<string>;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'api/doctors';
  }

  public list(filter: QueryParams): Observable<Doctor[]> {
    return this.httpService.get(this._api, { params: filter, authorize: true })
      .pipe<Doctor[]>(
        map((response: APIResponse) => response?.data.map((item: any) => new Doctor(item)))
      );
  }

  public search(values: string[]): Observable<Doctor[]> {
    return this.httpService.get(`${this._api}/search`, { params: { s: values }, authorize: true })
      .pipe<Doctor[]>(
        map((response: APIResponse) => response?.data.map((item: any) => new Doctor(item)))
      );
  }

  public get(id: number): Observable<Doctor> {
    return this.httpService.get(`${this._api}/${id}`, { authorize: true })
      .pipe<Doctor>(
        map((response: APIResponse) => new Doctor(response?.data))
      );
  }

  public post(data: Doctor): Observable<APIResponse> {
    return this.httpService.post(this._api, new CreateUpdateDoctorDTO(data), { authorize: true });
  }

  public put(id: number, data: Doctor): Observable<APIResponse> {
    return this.httpService.put(`${this._api}/${id}`, new CreateUpdateDoctorDTO(data), { authorize: true });
  }

  public delete(id: number): Observable<APIResponse> {
    return this.httpService.delete(`${this._api}/${id}`, { authorize: true });
  }
}
