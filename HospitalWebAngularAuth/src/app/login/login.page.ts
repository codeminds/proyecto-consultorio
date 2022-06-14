import { Component, OnInit } from '@angular/core';
import { ButtonType, InputType } from '@shared/components/form-field/form-field.types';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage implements OnInit {
  public username: string;
  public password: string;
  public loading: boolean;

  public InputType = InputType;
  public ButtonType = ButtonType;

  constructor() { 
    this.username = null;
    this.password = null;
    this.loading = false;
  }

  ngOnInit(): void {
  }

}
