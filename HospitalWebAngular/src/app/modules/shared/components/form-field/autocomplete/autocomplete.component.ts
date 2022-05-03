import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { EventsService } from '@shared/services/events/events.service';
import { Subject, takeUntil } from 'rxjs';
import { getProperty } from '../form-field.helpers';
import { Option } from '../form-field.types';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['../form-field.styles.css', './autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public showSelection?: boolean;

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
  private maxResultsHeight: number;
  private unsubscribe: Subject<void>;

  public get id(): string{
    return `${this.form}-${this.fieldName}`;
  }

  public get name(): string{
    return `${this.form}${this.fieldName}`;
  }

  //Propiedad para el placeholder sólo muestra el texto si no hemos seleccionado una opción
  public get placeholder(): string {
    return this.model == null || !this.showSelection ? this.placeholderText : '';
  }

  //Esta propiedad determina el alto máximo de la lista de resultados
  public get style(): string {
    const maxHeight = this.maxResultsHeight / 10;
    return `max-height: min(30rem, ${maxHeight > 15 ? maxHeight : 15}rem)`;
  }

  constructor(
    private eventsService: EventsService
  ) {
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
    this.showSelection = true;
    this.lookupFunction = null;
    this.search = null;
    this.loading = false;
    this.selectedIndex = null;
    this.results = null;
    this.focused = false;
    this.lookupTimeout = null;
    this.maxResultsHeight = 0;
    this.modelChange = new EventEmitter();
    this.unsubscribe = new Subject();
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

    //Utilizamos el servicio de eventos globales en vez de saturar el DOM
    //con eventos propios
    this.eventsService.bodyClick
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((e) =>  {
        if(![this.input.nativeElement, this.selection?.nativeElement].includes(e.target) 
            && document.activeElement != this.input.nativeElement)
        {
          this.blur();
        }
      });

    //Utilizamos el servicio de eventos globales en vez de saturar el DOM
    //con eventos propios
    this.eventsService.windowResize
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((e => {
        this.recalculateResultsMaxHeight();
      }))
  }

  //Técnica de unsubscribe de observables en componentes para evitar
  //filtrado de memoria. Al destruir el componente enviamos un notificación
  //al Subject unsubscribe y todos los observables con un pipe "takeUntil(this.unsubscribe)"
  //en el componente se desuscriben y liberan esa memoria
  public ngOnDestroy(): void {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

  public ngAfterViewInit(): void {
    this.recalculateResultsMaxHeight();
  }

  public lookup(): void {
    //Por medio de un indicador "loading" y un timeout de medio segundo
    //podemos filtrar que hayan varios eventos de búsqueda mientras el usuario
    //proporciona el valor de búsqueda que guste, así evitando una saturación del API
    if(!this.loading) {
      clearTimeout(this.lookupTimeout);
      this.lookupTimeout = setTimeout(async () => {
        //A la hora de intentar buscar por cualquier valor
        //el usuario ha cambiado de selección y se elimina cualquier
        //valor previo escogido
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

  //Navegación con teclado de las opciones
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

  //Navegación con teclado de las opciones
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

  //Navegación con teclado de las opciones
  public selectKeyPress(e: any) {
    e.stopPropagation();
    this.selectOption();
    this.blur();
    this.input.nativeElement.blur();
  }

  //Selección por click de la opción
  public selectIndex(index: number): void {
    this.selectedIndex = index;
    this.selectOption();
  }

  //El control interactivo es una combinación de elementos visuales por
  //lo que al recibir foco necesita ejecutar una serie de funcionalidades
  public focus() {
    this.focused = true;
    if(this.model != null && this.showSelection) {
      this.search = this.selection.nativeElement.textContent.trim();
    }
  }

  //El control interactivo es una combinación de elementos visuales por
  //lo que al perder foco necesita ejecutar una serie de funcionalidades
  //Esta función debe también ser llamada en varios lugares para simular la pérdida
  //de foco desde cualquier parte del componente visual.
  public blur(){
    this.focused = false;
    this.selectedIndex = null;
    this.search = null;
    this.results = null;
  }

  //Cuando el control pierde el foco y tenemos una opción seleccionada una máscara se pone
  //de frente con el valor seleccionado. Al darle click le damos foco al elemento interactivo
  //y esto desencadena una serie de acciones para hacer desaparecer la máscara
  public clickSelection() {
    this.input.nativeElement.focus();
  }

  private selectOption() {
    if(this.selectedIndex != null) {
      this.model = this.results[this.selectedIndex];
      this.onModelChange();
    }
  }

  private recalculateResultsMaxHeight(): void {
    const binding = this.input.nativeElement.getBoundingClientRect();
    this.maxResultsHeight = window.innerHeight - binding.bottom - 10;
  }

  private onModelChange() {
    this.modelChange.emit(getProperty(this.model, this.option.output));
  }
}
