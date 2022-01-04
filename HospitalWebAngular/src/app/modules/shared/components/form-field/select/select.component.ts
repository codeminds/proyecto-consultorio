import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Option } from '../form-field.types';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class SelectComponent implements OnInit {
  @Input('name')
  public fieldName: string;

  @Input()
  public form: string;

  
  @Input()
  public options: Option[];

  @Input()
  public label?: string;

  @Input()
  public model?: boolean | string | number;

  @Input()
  public hasAll?: boolean;


  @Output()
  public modelChange: EventEmitter<any>;

  public get name(){
    return `${this.form}${this.fieldName}`;
  }

  public get id(){
    return `${this.form}-${this.fieldName}`;
  }

  constructor() { 
    this.fieldName = null;
    this.form = null;
    this.options = [];
    this.label = null;
    this.model = null;
    this.hasAll = false;
    this.modelChange = new EventEmitter();
  }

  public ngOnInit(): void {
    if(this.options == null) {
      throw new Error('Property options is required');
    }

    if(!this.fieldName) {
      throw new Error('Property name is required');
    }

    if(!this.form) {
      throw new Error('Property form is required');
    }
  }

  public onModelChange(value: boolean | string | number) {
    this.modelChange.emit(value);
  }
}
