import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { QueryParams, APIResponse } from '@services/http/http.types';
import { Observable, map } from 'rxjs';
import { CreateUpdateAppointmentDTO } from './appointment.dto';
import { Appointment } from './appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'appointments';
  }

  public list(filter: QueryParams): Observable<APIResponse<Appointment[]>> {
    return this.httpService.get(this._api, { params: filter, authorize: true }).mapArrayResponse((item: object) => new Appointment(item));
  }

  public get(id: number): Observable<APIResponse<Appointment>> {
    return this.httpService.get(`${this._api}/${id}`, { authorize: true }).mapObjectResponse((item: object) => new Appointment(item));
  }

  public post(data: Appointment): Observable<APIResponse<Appointment>> {
    return this.httpService.post(this._api, new CreateUpdateAppointmentDTO(data), { authorize: true }).mapObjectResponse((item: object) => new Appointment(item));
  }

  public put(id: number, data: Appointment): Observable<APIResponse<Appointment>> {
    return this.httpService.put(`${this._api}/${id}`, new CreateUpdateAppointmentDTO(data), { authorize: true }).mapObjectResponse((item: object) => new Appointment(item));
  }

  public delete(id: number): Observable<APIResponse<Appointment>> {
    return this.httpService.delete(`${this._api}/${id}`, { authorize: true }).mapObjectResponse((item: object) => new Appointment(item));
  }
}
