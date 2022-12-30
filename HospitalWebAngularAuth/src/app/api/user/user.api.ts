import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse } from '@services/http/http.types';
import { Store } from '@store';
import { firstValueFrom, Observable } from 'rxjs';
import { UpdateUserEmail, UpdateUserInfo, UpdateUserPassword } from './user.dto';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private readonly _api: string;

  constructor(
    private httpService: HttpService,
    private store: Store
  ) {
    this._api = 'users';
  }

  public async load(): Promise<void> {
    const response = await firstValueFrom(this.httpService.get(`${this._api}/me`, { accessToken: true }).mapObjectResponse((item: object) => new User(item)));
    if(response.success) {
      this.store.user = response.data;
    }
  }

  public patchInfo(data: User): Observable<APIResponse<User>> {
    return this.httpService.patch(`${this._api}/info`, new UpdateUserInfo(data), { accessToken: true }).mapObjectResponse((item: object) => new User(item));
  }

  public patchEmail(data: User): Observable<APIResponse<User>> {
    return this.httpService.patch(`${this._api}/email`, new UpdateUserEmail(data), { accessToken: true }).mapObjectResponse((item: object) => new User(item));
  }

  public patchPassword(data: string): Observable<APIResponse<User>> {
    return this.httpService.patch(`${this._api}/password`, new UpdateUserPassword(data), { accessToken: true }).mapObjectResponse((item: object) => new User(item));
  }
}
