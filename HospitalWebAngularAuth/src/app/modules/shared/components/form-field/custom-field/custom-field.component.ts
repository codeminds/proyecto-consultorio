import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class CustomFieldComponent {
  @Input()
  public label?: string;

  constructor() { 
    this.label = null;
  }
}