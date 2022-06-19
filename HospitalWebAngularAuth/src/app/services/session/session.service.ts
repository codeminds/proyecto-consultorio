import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse } from '@services/http/http.types';
import { Observable } from 'rxjs';
import { LoginSessionDTO } from './session.dto';
import { Session, SessionTokens } from './session.model';

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

  public login(username: string, password: string): Observable<APIResponse<SessionTokens>> {
    return this.httpService.post(this._api, new LoginSessionDTO(username, password)).mapObjectResponse((item: object) => new SessionTokens(item));
  }

  public logout(sessionId: string = null): Observable<APIResponse<Session>> {
    return this.httpService.delete(`${this._api}/${sessionId || ''}`).mapObjectResponse((item: object) => new Session(item));
  }

  public refresh(): Observable<APIResponse<SessionTokens>> {
    return this.httpService.patch(this._api, null, { refreshToken: true }).mapObjectResponse((item: object) => new SessionTokens(item));
  }
}
