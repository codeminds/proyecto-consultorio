import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType } from '../form-field.types';
import { ButtonClass } from './button.types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class ButtonComponent {
  @Input()
  public type?: ButtonType;

  @Input()
  public disabled: boolean;

  @Input('button-class')
  public buttonClass: ButtonClass

  @Output()
  public clicked: EventEmitter<MouseEvent>;

  constructor() {
    this.type = ButtonType.None;
    this.disabled = false;
    this.buttonClass = null;
    this.clicked = new EventEmitter(); 
  }

  public onClick(e: MouseEvent): void {
    this.clicked.emit(e);
  }
}
