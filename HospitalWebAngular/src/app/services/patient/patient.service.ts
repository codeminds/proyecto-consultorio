import { Injectable } from '@angular/core';
import { APIResponse, QueryParams } from '@services/http/http.types';
import { HttpService } from '@services/http/http.service';
import { map, Observable } from 'rxjs';
import { CreateUpdatePatientDTO } from './patient.dto';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService{
  private _api: Readonly<string>;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'api/patients';
  }

  public list(filter: QueryParams): Observable<Patient[]> {
    return this.httpService.get(this._api, filter)
      .pipe<Patient[]>(
        map((response: APIResponse) => response?.data.map((item: any) => new Patient(item)))
      );
  }

  public get(id: number): Observable<Patient> {
    return this.httpService.get(`${this._api}/${id}`)
      .pipe<Patient>(
        map((response: APIResponse) => new Patient(response?.data))
      );
  }

  public post(data: Patient): Observable<APIResponse> {
    return this.httpService.post(this._api, new CreateUpdatePatientDTO(data));
  }

  public put(id: number, data: Patient): Observable<APIResponse> {
    return this.httpService.put(`${this._api}/${id}`, new CreateUpdatePatientDTO(data));
  }

  public delete(id: number): Observable<APIResponse> {
    return this.httpService.delete(`${this._api}/${id}`);
  }
}
