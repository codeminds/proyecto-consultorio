import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { QueryParams, APIResponse } from '@services/http/http.types';
import { Observable } from 'rxjs';
import { InsertUpdateAppointmentDTO } from './appointment.dto';
import { Appointment } from './appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentApi {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'appointments';
  }

  public list(filter: QueryParams): Observable<APIResponse<Appointment[]>> {
    return this.httpService.get(this._api, filter).mapArrayResponse((item: object) => new Appointment(item));
  }

  public find(id: number): Observable<APIResponse<Appointment>> {
    return this.httpService.get(`${this._api}/${id}`).mapObjectResponse((item: object) => new Appointment(item));
  }

  public insert(data: Appointment): Observable<APIResponse<Appointment>> {
    return this.httpService.post(this._api, new InsertUpdateAppointmentDTO(data)).mapObjectResponse((item: object) => new Appointment(item));
  }

  public update(data: Appointment): Observable<APIResponse<Appointment>> {
    return this.httpService.put(`${this._api}/${data.id}`, new InsertUpdateAppointmentDTO(data)).mapObjectResponse((item: object) => new Appointment(item));;
  }

  public delete(id: number): Observable<APIResponse<Appointment>> {
    return this.httpService.delete(`${this._api}/${id}`).mapObjectResponse((item: object) => new Appointment(item));;
  }
}
