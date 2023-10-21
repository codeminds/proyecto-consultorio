import { Injectable } from '@angular/core';
import { APIResponse } from '@services/http/http.types';
import { HttpService } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { FilterDoctorDTO, InsertUpdateDoctorDTO } from './doctor.dto';
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

  public list(filter: FilterDoctorDTO): Observable<APIResponse<Doctor[]>> {
    return this.httpService.get(this._api, { params: filter }).mapArrayResponse((item: object) => new Doctor(item));
  }

  public search(values: string[]): Observable<APIResponse<Doctor[]>> {
    return this.httpService.get(`${this._api}/search`, { params: { s: values } }).mapArrayResponse((item: object) => new Doctor(item));
  }

  public insert(data: Doctor): Observable<APIResponse<Doctor>> {
    return this.httpService.post(this._api, new InsertUpdateDoctorDTO(data)).mapObjectResponse((item: object) => new Doctor(item));
  }

  public update(data: Doctor): Observable<APIResponse<Doctor>> {
    return this.httpService.put(`${this._api}/${data.id}`, new InsertUpdateDoctorDTO(data)).mapObjectResponse((item: object) => new Doctor(item));
  }

  public delete(id: number): Observable<APIResponse<Doctor>> {
    return this.httpService.delete(`${this._api}/${id}`).mapObjectResponse((item: object) => new Doctor(item));
  }
}
