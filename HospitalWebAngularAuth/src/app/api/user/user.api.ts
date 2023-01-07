import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { APIResponse, QueryParams } from '@services/http/http.types';
import { Store } from '@store';
import { firstValueFrom, Observable } from 'rxjs';
import { InsertUpdateUserDTO } from './user.dto';
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

  public list(filter: QueryParams): Observable<APIResponse<User[]>> {
    return this.httpService.get(this._api, { params: filter, accessToken: true }).mapArrayResponse((item: object) => new User(item));
  }

  public post(data: User, password: string): Observable<APIResponse<User>> {
    return this.httpService.post(this._api, new InsertUpdateUserDTO(data, password), { accessToken: true }).mapObjectResponse((item: object) => new User(item));
  }

  public put(data: User, password: string): Observable<APIResponse<User>> {
    return this.httpService.put(`${this._api}/${data.id}`, new InsertUpdateUserDTO(data, password), { accessToken: true }).mapObjectResponse((item: object) => new User(item));
  }

  public putSelf(data: User, password: string): Observable<APIResponse<User>> {
    return this.httpService.put(`${this._api}/me`, new InsertUpdateUserDTO(data, password), { accessToken: true }).mapObjectResponse((item: object) => new User(item));
  }

  public delete(id: number): Observable<APIResponse<User>> {
    return this.httpService.delete(`${this._api}/${id}`, { accessToken: true }).mapObjectResponse((item: object) => new User(item));
  }
}
