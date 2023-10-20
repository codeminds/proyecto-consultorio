import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionApi } from '@api/session/session.api';
import { InputType } from '@shared/components/form-field/form-field.types';
import { StorageKeys } from '@utils/constants';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  public username: string;
  public password: string;
  public loading: boolean;
  public messages: string[];

  public InputType = InputType;

  constructor(
    private sessionApi: SessionApi,
    private router: Router
  ) { 
    this.username = null;
    this.password = null;
    this.loading = false;
    this.messages = [];
  }

  public async login(): Promise<void> {
    if(!this.loading) {
      this.loading = true;
      this.messages = [];

      //Si el proceso de ingreso es correcto se procede a crear en el almacenamiento local
      //los tokens de acceso y refrescado para utilizar en el sistema
      const response = await firstValueFrom(this.sessionApi.login(this.username, this.password));
      if(response.success) {
        localStorage.setItem(StorageKeys.ACCESS_TOKEN, response.data.accessToken);
        localStorage.setItem(StorageKeys.REFRESH_TOKEN, response.data.refreshToken);

        this.router.navigate(['']);
      } else {
        this.messages = response.messages;
        this.password = null;
      }

      this.loading = false;
    }
  }
}
