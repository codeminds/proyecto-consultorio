import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@services/session/session.service';
import { ButtonType, InputType } from '@shared/components/form-field/form-field.types';
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
  public ButtonType = ButtonType;

  constructor(
    private sessionService: SessionService,
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

      const response = await firstValueFrom(this.sessionService.login(this.username, this.password));
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
