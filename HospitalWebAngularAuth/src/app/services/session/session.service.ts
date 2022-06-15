import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse } from '@services/http/http.types';
import { Observable } from 'rxjs';
import { LoginSessionDTO } from './session.dto';
import { Session } from './session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'sessions';
  }

  public login(username: string, password: string): Observable<APIResponse> {
    return this.httpService.post(this._api, new LoginSessionDTO(username, password));
  }
}
