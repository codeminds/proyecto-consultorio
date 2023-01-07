import { Injectable } from '@angular/core';
import { APIResponse, QueryParams } from '@services/http/http.types';
import { HttpService } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { InsertUpdatePatientDTO } from './patient.dto';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientApi{
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'patients';
  }

  public list(filter: QueryParams): Observable<APIResponse<Patient[]>> {
    return this.httpService.get(this._api, { params: filter, accessToken: true }).mapArrayResponse((item: object) => new Patient(item));
  }

  public search(values: string[]): Observable<APIResponse<Patient[]>> {
    return this.httpService.get(`${this._api}/search`, { params: { s: values }, accessToken: true }).mapArrayResponse((item: object) => new Patient(item));
  }

  public get(id: number): Observable<APIResponse<Patient>> {
    return this.httpService.get(`${this._api}/${id}`, { accessToken: true }).mapObjectResponse((item: object) => new Patient(item));
  }

  public post(data: Patient): Observable<APIResponse<Patient>> {
    return this.httpService.post(this._api, new InsertUpdatePatientDTO(data), { accessToken: true }).mapObjectResponse((item: object) => new Patient(item));
  }

  public put(data: Patient): Observable<APIResponse<Patient>> {
    return this.httpService.put(`${this._api}/${data.id}`, new InsertUpdatePatientDTO(data), { accessToken: true }).mapObjectResponse((item: object) => new Patient(item));
  }

  public delete(id: number): Observable<APIResponse<Patient>> {
    return this.httpService.delete(`${this._api}/${id}`, { accessToken: true }).mapObjectResponse((item: object) => new Patient(item));
  }
}
