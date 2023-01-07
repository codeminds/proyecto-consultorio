import { Injectable } from '@angular/core';
import { APIResponse, QueryParams } from '@services/http/http.types';
import { HttpService } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { CreateUpdatePatientDTO } from './patient.dto';
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
    return this.httpService.get(this._api, filter).mapArrayResponse((item: object) => new Patient(item));
  }

  public search(values: string[]): Observable<APIResponse<Patient[]>> {
    return this.httpService.get(`${this._api}/search`, { s: values }).mapArrayResponse((item: object) => new Patient(item));
  }

  public get(id: number): Observable<APIResponse<Patient>> {
    return this.httpService.get(`${this._api}/${id}`).mapObjectResponse((item: object) => new Patient(item));
  }

  public post(data: Patient): Observable<APIResponse<Patient>> {
    return this.httpService.post(this._api, new CreateUpdatePatientDTO(data)).mapObjectResponse((item: object) => new Patient(item));
  }

  public put(data: Patient): Observable<APIResponse<Patient>> {
    return this.httpService.put(`${this._api}/${data.id}`, new CreateUpdatePatientDTO(data)).mapObjectResponse((item: object) => new Patient(item));
  }

  public delete(id: number): Observable<APIResponse<Patient>> {
    return this.httpService.delete(`${this._api}/${id}`).mapObjectResponse((item: object) => new Patient(item));
  }
}
