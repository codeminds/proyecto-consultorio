import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { getProperty } from '../form-field.helpers';
import { Option } from '../form-field.types';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['../form-field.styles.css', './autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
  @Input()
  public selectionTemplate: TemplateRef<any>;
  
  @Input('name')
  public fieldName: string;

  @Input()
  public form: string;

  @Input()
  public infoTemplate?: TemplateRef<any>;

  @Input()
  public label?: string;

  @Input()
  public model?: any;

  @Input()
  public option?: Option;

  @Input()
  public maxItems?: number;

  @Input()
  public lookupFunction: (search: string, maxItems?: number) => Promise<any[]>;

  @Output()
  public modelChange: EventEmitter<any>;

  @ViewChild('input')
  private input: ElementRef;

  public search: string;
  public loading: boolean;
  public selectedIndex: number;
  public results: any[];

  public getProperty = getProperty;

  private lookupTimeout: any;
  private focused: boolean;

  public get id(): string{
    return `${this.form}-${this.fieldName}`;
  }

  public get name(): string{
    return `${this.form}${this.fieldName}`;
  }

  constructor() {
    this.selectionTemplate = null; 
    this.fieldName = null;
    this.form = null;
    this.infoTemplate = null;
    this.label = null;
    this.model = null;
    this.option = null;
    this.option = Option.default;
    this.maxItems = null;
    this.lookupFunction = null;
    this.search = null;
    this.loading = false;
    this.selectedIndex = null;
    this.lookupTimeout = null;
    this.focused = false;
    this.modelChange = new EventEmitter();
  }

  public ngOnInit(): void {
    /*if(this.selectionTemplate == null) {
      throw new Error('Property selectionTemplate is required');
    }*/

    if(!this.name) {
      throw new Error('Property name is required');
    }

    if(!this.form) {
      throw new Error('Property form is required');
    }

    if(!this.lookupFunction) {
      throw new Error('Property lookupFunction is required');
    }
  }

  public lookup(): void {
    if(!this.loading) {
      if(this.lookupTimeout != null) {
        clearTimeout(this.lookupTimeout);
        this.lookupTimeout = null;
      }

      this.lookupTimeout = setTimeout(async () => {
        this.loading = true;
        this.selectedIndex = null;
        this.results = await this.lookupFunction(this.search, this.maxItems);
        this.lookupTimeout = null;
        this.loading = false;
      }, 500);
    }
  }

  public increaseIndex(): void {
    if(this.results?.length > 0) {
      if(this.selectedIndex < this.results.length - 1){
        this.selectedIndex++;
      } else {
        this.selectedIndex = 0;
      }
    }
  }

  public decreaseIndex(): void {
    if(this.results?.length > 0) {
      if(this.selectedIndex > 0){
        this.selectedIndex--; 
      } else {
        this.selectedIndex = this.results.length - 1;
      }
    }
  }

  public selectIndex(index: number): void {
    console.log('select index');
    this.selectedIndex = index;
    this.selectOption();
  }

  public selectOption() {
    if(this.selectedIndex != null) {
      console.log('select option');
      this.model = this.results[this.selectedIndex];
      this.onModelChange();
      this.focused = false;
    }

    this.input.nativeElement.blur();
  }

  public resetOption() {
    this.model = null;
    this.onModelChange();
  }

  public clearResults() {
    if(!this.focused) {
      console.log('clear results');
      this.results = [];
    }
  }

  public focus() {
    this.focused = true;
  }

  public onModelChange() {
    this.modelChange.emit(getProperty(this.model, this.option.value));
  }
}
