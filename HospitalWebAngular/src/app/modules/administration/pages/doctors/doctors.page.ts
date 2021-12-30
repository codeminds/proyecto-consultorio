import { Component, OnInit } from '@angular/core';
import { InputType } from '@shared/components/form-field/form-field.types';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.css']
})
export class DoctorsPage implements OnInit {
  public name: string;
  public check: boolean;
  public gender: boolean;
  public open: boolean;

  public InputType = InputType;

  constructor() { 
    this.name = null;
    this.check = false;
    this.gender = false;
    this.open = true;
  }

  ngOnInit(): void {
  }

}
