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
  private _api: Readonly<string>;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'appointments';
  }

  public list(filter: QueryParams): Observable<Appointment[]> {
    return this.httpService.get(this._api, filter)
      .pipe<Appointment[]>(
        map((response: APIResponse) => response?.data.map((item: any) => new Appointment(item)))
      );
  }

  public get(id: number): Observable<Appointment> {
    return this.httpService.get(`${this._api}/${id}`)
      .pipe<Appointment>(
        map((response: APIResponse) => new Appointment(response?.data))
      );
  }

  public post(data: Appointment): Observable<APIResponse> {
    return this.httpService.post(this._api, new CreateUpdateAppointmentDTO(data));
  }

  public put(id: number, data: Appointment): Observable<APIResponse> {
    return this.httpService.put(`${this._api}/${id}`, new CreateUpdateAppointmentDTO(data));
  }

  public delete(id: number): Observable<APIResponse> {
    return this.httpService.delete(`${this._api}/${id}`);
  }
}
