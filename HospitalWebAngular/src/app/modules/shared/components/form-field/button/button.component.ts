import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType } from '../form-field.types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class ButtonComponent {
  @Input()
  public type?: ButtonType;

  @Input()
  public disabled?: boolean;

  @Input()
  public loading?: boolean

  @Output()
  public clicked: EventEmitter<MouseEvent>;

  constructor() {
    this.type = ButtonType.None;
    this.disabled = false;
    this.loading = false;
    this.clicked = new EventEmitter(); 
  }

  public onClick(e: MouseEvent): void {
    this.clicked.emit(e);
  }
}
