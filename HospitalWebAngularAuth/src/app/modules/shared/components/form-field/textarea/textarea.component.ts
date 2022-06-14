import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class TextareaComponent implements OnInit {
  @Input('name')
  public fieldName: string;

  @Input()
  public form: string;
  
  @Input()
  public label?: string;

  @Input()
  public model?: string;

  @Input()
  public placeholder?: string;

  @Input()
  public resizable?: boolean;

  @Output()
  public modelChange: EventEmitter<string>;

  public get id(){
    return `${this.form}-${this.fieldName}`;
  }

  public get name(){
    return `${this.form}${this.fieldName}`;
  }

  constructor() { 
    this.fieldName = null;
    this.form = null;
    this.label = null;
    this.model = null;
    this.placeholder = null;
    this.resizable = false;
    this.modelChange = new EventEmitter();
  }

  public ngOnInit(): void {
    if(!this.fieldName) {
      throw new Error('Property name is required');
    }

    if(!this.form) {
      throw new Error('Property form is required');
    }
  }

  public onModelChange(value: string) {
    this.modelChange.emit(value);
  }
}
