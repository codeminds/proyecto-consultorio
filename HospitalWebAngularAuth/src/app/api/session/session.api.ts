import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse, QueryParams } from '@services/http/http.types';
import { Observable } from 'rxjs';
import { LoginSessionDTO } from './session.dto';
import { Session, SessionTokens } from './session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionApi {
  private readonly _api: string;

  constructor(
    private httpService: HttpService
  ) {
    this._api = 'sessions';
  }

  public list(filter: QueryParams): Observable<APIResponse<Session[]>> {
    return this.httpService.get(this._api, { params: filter, accessToken: true }).mapArrayResponse((item: object) => new Session(item));
  }
  
  public login(username: string, password: string): Observable<APIResponse<SessionTokens>> {
    return this.httpService.post(this._api, new LoginSessionDTO(username, password)).mapObjectResponse((item: object) => new SessionTokens(item));
  }

  public logout(sessionId: string = null): Observable<APIResponse<Session>> {
    return this.httpService.delete(`${this._api}/${sessionId || ''}`, { accessToken: true }).mapObjectResponse((item: object) => new Session(item));
  }

  public refresh(): Observable<APIResponse<SessionTokens>> {
    return this.httpService.patch(this._api, null, { refreshToken: true }).mapObjectResponse((item: object) => new SessionTokens(item));
  }
}
