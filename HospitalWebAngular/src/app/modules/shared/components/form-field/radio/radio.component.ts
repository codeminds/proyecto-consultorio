import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Option } from '../form-field.types';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class RadioComponent implements OnInit, OnChanges {
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
  public inline?: boolean;

  @Input()
  public hasAll?: boolean;

  @Output()
  public modelChange: EventEmitter<any>;

  public get name(){
    return `${this.form}${this.fieldName}`;
  }

  constructor() { 
    this.fieldName = null;
    this.form = null;
    this.options = [];
    this.label = null;
    this.model = null;
    this.inline = false;
    this.hasAll = false;
    this.modelChange = new EventEmitter();
  }

  public ngOnInit(): void {
    if(this.options == null || this.options.length == 0) {
      throw new Error('Property options is required');
    }

    if(!this.fieldName) {
      throw new Error('Property name is required');
    }

    if(!this.form) {
      throw new Error('Property form is required');
    }
  }

  public ngOnChanges(): void {
      if(this.model == null) {
        this.model = '';
      }
  }

  public onModelChange(value: boolean | string | number) {
    this.modelChange.emit(value !== '' ? value : null);
  }
}
