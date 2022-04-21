import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Attributes, DateType } from '../form-field.types';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class DateComponent implements OnInit, OnChanges {
  @Input('name')
  public fieldName: string;

  @Input()
  public form: string;

  @Input()
  public label?: string;

  @Input()
  public model?: Date;

  @Input()
  public type: DateType;

  @Input()
  public attributes?: Attributes;

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

  public dateStringModel: string;

  constructor() { 
    this.fieldName = null;
    this.form = null;
    this.label = null;
    this.model = null;
    this.type = null;
    this.attributes = null;
    this.dateStringModel = null;
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

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty('model') && this.model !== null) {
      if(this.model != null && !Date.isDate(this.model)){
        throw new Error('Property model is not of type Date');
      }

      this.dateStringModel = this.model?.toInputDateString(this.type == DateType.DateTime);
    }
  }

  public ngAfterViewInit(): void {
    if(this.attributes != null) {
      for(const prop in this.attributes) {
        this.input.nativeElement.setAttribute(prop, this.attributes[prop]);
      }
    }
  }

  public onModelChange(value: string) {
    this.modelChange.emit(value ? new Date(value) : null);
  }
}
