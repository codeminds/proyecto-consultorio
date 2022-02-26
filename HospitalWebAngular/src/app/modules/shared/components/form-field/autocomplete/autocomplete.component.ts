import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { getProperty } from '../form-field.helpers';
import { Option } from '../form-field.types';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['../form-field.styles.css', './autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
  @HostListener('body: click', ['$event'])
  public onDocumentClick(event: any) {
    console.log('clicked', event.target);
    if(![this.input.nativeElement, this.selection?.nativeElement].includes(event.target))
    {
      console.log('blur');
      this.blur();
    }
  }

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

  @Input('placeholder')
  public placeholderText?: string;

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

  @ViewChild('selection')
  private selection: ElementRef;

  public search: string;
  public loading: boolean;
  public selectedIndex: number;
  public results: any[];
  public focused: boolean;

  public getProperty = getProperty;

  private lookupTimeout: NodeJS.Timeout;
  private selectionFocused: boolean;

  public get id(): string{
    return `${this.form}-${this.fieldName}`;
  }

  public get name(): string{
    return `${this.form}${this.fieldName}`;
  }

  public get placeholder(): string {
    return this.model == null ? this.placeholderText : '';
  }

  constructor() {
    this.selectionTemplate = null; 
    this.fieldName = null;
    this.form = null;
    this.infoTemplate = null;
    this.label = null;
    this.placeholderText = null;
    this.model = null;
    this.option = null;
    this.option = Option.default;
    this.maxItems = null;
    this.lookupFunction = null;
    this.search = null;
    this.loading = false;
    this.selectedIndex = null;
    this.results = null;
    this.focused = false;
    this.lookupTimeout = null;
    this.selectionFocused = false;
    this.modelChange = new EventEmitter();
  }

  public ngOnInit(): void {
    if(this.selectionTemplate == null) {
      throw new Error('Property selectionTemplate is required');
    }

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
      clearTimeout(this.lookupTimeout);
      this.lookupTimeout = setTimeout(async () => {
        this.model = null;
        this.onModelChange();
        if(this.search) {
          this.loading = true;
          this.selectedIndex = null;
          this.results = await this.lookupFunction(this.search, this.maxItems);
          this.lookupTimeout = null;
          this.loading = false;
        }
      }, 500);
    }
  }

  public increaseIndex(e: any): void {
    e.preventDefault();
    if(this.results?.length > 0) {
      if(this.selectedIndex != null && this.selectedIndex < this.results.length - 1){
        this.selectedIndex++;
      } else {
        this.selectedIndex = 0;
      }
    }
  }

  public decreaseIndex(e: any): void {
    e.preventDefault();
    if(this.results?.length > 0) {
      if(this.selectedIndex > 0){
        this.selectedIndex--; 
      } else {
        this.selectedIndex = this.results.length - 1;
      }
    }
  }

  public selectKeyPress(e: any) {
    e.stopPropagation();
    this.selectOption();
    this.blur();
    this.input.nativeElement.blur();
  }

  public selectIndex(index: number): void {
    this.selectedIndex = index;
    this.selectOption();
  }

  public selectOption() {
    if(this.selectedIndex != null) {
      this.model = this.results[this.selectedIndex];
      this.onModelChange();
    }
  }

  public focus() {
    this.focused = true;
    if(this.model != null) {
      this.search = this.selection.nativeElement.textContent.trim();
    }
  }

  public blur(){
    this.focused = false;
    this.search = null;
    this.results = null;
    this.selectedIndex = null;
  }

  public clickSelection() {
    this.input.nativeElement.focus();
  }

  public onModelChange() {
    this.modelChange.emit(getProperty(this.model, this.option.value));
  }
}
