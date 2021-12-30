import { Component } from '@angular/core';
import { ButtonType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalSize } from '@shared/components/modal/modal.types';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.css']
})
export class DoctorsPage {
  public name: string;
  public check: boolean;
  public gender: boolean;
  public open: boolean;
  public modal1Open: boolean;
  public modal2Open: boolean;

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ButtonType = ButtonType;

  constructor() { 
    this.name = null;
    this.check = false;
    this.gender = false;
    this.open = true;
    this.modal1Open = false;
    this.modal2Open = false;
  }
}
