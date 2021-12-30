import { Injectable } from '@angular/core';
import { APIResponse, QueryParams } from '@services/http/http.types';
import { HttpService } from '@services/http/http.service';
import { map, Observable } from 'rxjs';
import { CreateUpdaterDoctorDTO } from './doctor.dto';
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
    return this.httpService.get(this._api, filter)
      .pipe<Doctor[]>(
        map((response: APIResponse) => response.data.map((item: any) => new Doctor(item)))
      );
  }

  public get(id: number): Observable<Doctor> {
    return this.httpService.get(`${this._api}/${id}`)
      .pipe<Doctor>(
        map((response: APIResponse) => new Doctor(response.data))
      );
  }

  public post(data: Doctor): Observable<APIResponse> {
    return this.httpService.post(this._api, new CreateUpdaterDoctorDTO(data));
  }

  public put(id: number, data: Doctor): Observable<APIResponse> {
    return this.httpService.put(`${this._api}/${id}`, new CreateUpdaterDoctorDTO(data));
  }
}
