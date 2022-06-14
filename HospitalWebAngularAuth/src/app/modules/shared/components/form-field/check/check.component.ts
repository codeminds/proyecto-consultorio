import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class CheckComponent implements OnInit {
  @Input('name')
  public fieldName: string;

  @Input()
  public form: string;
  
  @Input()
  public label: string;

  @Input()
  public model?: boolean;

  @Input()
  public inline?: boolean;

  @Output()
  public modelChange: EventEmitter<boolean>;

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
    this.model = false;
    this.inline = false;
    this.modelChange = new EventEmitter();
  }

  public ngOnInit(): void {
    if(!this.label) {
      throw new Error('Property label is required');
    }

    if(!this.fieldName) {
      throw new Error('Property name is required');
    }

    if(!this.form) {
      throw new Error('Property form is required');
    }
  }

  public onModelChange(value: boolean): void {
    this.modelChange.emit(value);
  }
}
