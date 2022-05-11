import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Attributes, InputType } from '../form-field.types';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class InputComponent implements OnInit, AfterViewInit {
  @Input('name')
  public fieldName: string;

  @Input()
  public form: string;

  @Input()
  public type: InputType;

  @Input()
  public label?: string;

  @Input()
  public model?: string | number;

  @Input()
  public attributes?: Attributes;

  @Output()
  public modelChange: EventEmitter<any>;

  @ViewChild('input')
  private inputRef: ElementRef;

  public get id(): string{
    return `${this.form}-${this.fieldName}`;
  }

  public get name(): string{
    return `${this.form}${this.fieldName}`;
  }

  constructor() { 
    this.fieldName = null;
    this.form = null;
    this.type = null;
    this.label = null;
    this.model = null;
    this.attributes = null;
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

  public ngAfterViewInit(): void {
    if(this.attributes != null) {
      for(const prop in this.attributes) {
        this.inputRef.nativeElement.setAttribute(prop, this.attributes[prop]);
      }
    }
  }

  public onModelChange(value: string | number): void {
    this.modelChange.emit(value);
  }
}
