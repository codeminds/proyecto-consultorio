import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { getProperty } from '../form-field.helpers';
import { InputType } from '../form-field.types';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['../form-field.styles.css', './autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
  @Input('name')
  public fieldName: string;

  @Input()
  public form: string;

  @Input()
  public type: InputType;

  @Input()
  public label?: string;

  @Input()
  public model?: any;

  @Output()
  public modelChange: EventEmitter<any>;

  @ViewChild('input')
  private input: ElementRef;

  public get id(): string{
    return `${this.form}-${this.fieldName}`;
  }

  public get name(): string{
    return `${this.form}${this.fieldName}`;
  }

  public getProperty = getProperty;

  constructor() { 
    this.fieldName = null;
    this.form = null;
    this.type = null;
    this.label = null;
    this.model = null;
    this.modelChange = new EventEmitter();
  }

  public ngOnInit(): void {
    if(!this.name) {
      throw new Error('Property name is required');
    }

    if(!this.form) {
      throw new Error('Property form is required');
    }

    if(!this.type) {
      throw new Error('Property type is required');
    }
  }

  public onModelChange(value: string | number) {
    this.modelChange.emit(value);
  }
}
