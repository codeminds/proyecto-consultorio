import { Injectable } from '@angular/core';
import { HttpService } from '@services/http/http.service';
import { Store } from '@store';
import { firstValueFrom } from 'rxjs';
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
    const response = await firstValueFrom(this.httpService.get(this._api, { accessToken: true }).mapObjectResponse((item: object) => new User(item)));
    if(response.success) {
      this.store.user = response.data;
    }
  }
}
