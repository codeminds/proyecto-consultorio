import { Injectable } from '@angular/core';
import { APIResponse } from '@services/http/http.types';
import { HttpService } from '@services/http/http.service';
import { Observable } from 'rxjs';
import { FilterPatientDTO, InsertUpdatePatientDTO } from './patient.dto';
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

  public list(filter: FilterPatientDTO): Observable<APIResponse<Patient[]>> {
    return this.httpService.get(this._api, { params: filter }).mapArrayResponse((item: object) => new Patient(item));
  }

  public search(values: string[]): Observable<APIResponse<Patient[]>> {
    return this.httpService.get(`${this._api}/search`, { params: { s: values } }).mapArrayResponse((item: object) => new Patient(item));
  }

  public insert(data: Patient): Observable<APIResponse<Patient>> {
    return this.httpService.post(this._api, new InsertUpdatePatientDTO(data)).mapObjectResponse((item: object) => new Patient(item));
  }

  public update(data: Patient): Observable<APIResponse<Patient>> {
    return this.httpService.put(`${this._api}/${data.id}`, new InsertUpdatePatientDTO(data)).mapObjectResponse((item: object) => new Patient(item));
  }

  public delete(id: number): Observable<APIResponse<Patient>> {
    return this.httpService.delete(`${this._api}/${id}`).mapObjectResponse((item: object) => new Patient(item));
  }
}
