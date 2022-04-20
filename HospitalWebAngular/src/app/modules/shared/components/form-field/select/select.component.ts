import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { EventsService } from '@shared/services/events/events.service';
import { Subject, takeUntil } from 'rxjs';
import { getProperty } from '../form-field.helpers';
import { Option } from '../form-field.types';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['../form-field.styles.css']
})
export class SelectComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input('name')
  public fieldName: string;

  @Input()
  public form: string;

  @Input()
  public infoTemplate?: TemplateRef<any>;
  
  @Input()
  public options: any[];

  @Input()
  public option?: Option;

  @Input()
  public label?: string;

  @Input()
  public model?: any;

  @Input()
  public nullOption?: string;

  @Output()
  public modelChange: EventEmitter<any>;

  @ViewChild('select')
  private select: ElementRef;

  public selectedIndex: number;
  public open: boolean;

  public getProperty = getProperty;

  private maxResultsHeight: number;
  private unsubscribe: Subject<void>;

  public get name(){
    return `${this.form}${this.fieldName}`;
  }

  public get id(){
    return `${this.form}-${this.fieldName}`;
  }

  //Esta propiedad determina el alto máximo de la lista de resultados
  public get style(): string {
    const maxHeight = this.maxResultsHeight / 10;
    return `max-height: min(30rem, ${maxHeight > 15 ? maxHeight : 15}rem)`;
  }

  constructor(
    private eventsService: EventsService
  ) { 
    this.fieldName = null;
    this.form = null;
    this.infoTemplate = null;
    this.options = [];
    this.option = Option.default;
    this.label = null;
    this.model = null;
    this.nullOption = null;
    this.selectedIndex = null;
    this.open = false;
    this.maxResultsHeight = 0;
    this.modelChange = new EventEmitter();
    this.unsubscribe = new Subject();
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

    //Utilizamos el servicio de eventos globales en vez de saturar el DOM
    //con eventos propios
    this.eventsService.bodyClick
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((e) =>  {
        if(![this.select.nativeElement].includes(e.target))
        {
          this.toggle(false);
        }
      });

    //Utilizamos el servicio de eventos globales en vez de saturar el DOM
    //con eventos propios
    this.eventsService.windowResize
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((e => {
        this.recalculateResultsMaxHeight();
      }));
  }

  //El modelo del select es un número que es el índice de selección
  //del mismo, para poder mandar todo tipo de objetos como la lista
  //para llenar los valores. De esta manera podemos emitir los objetos enteros
  //o valor de tipo básico libremente sin tener que crear lógica externa para obtenerlo
  //de listas o mappear entre tipos. Esto significa que también hay que crear lógica
  //especial para que al recibir un valor externo de los input properties este sea
  //mappeado automáticamente al index de la opción apropiada.
  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty('model') || changes.hasOwnProperty('options')) {
      //En caso de tener una opción nula hay que forzar el valor del index
      //ya que el ngModel del select no está ligado con nuestro modelo como
      //en otros componentes
      if(this.model == null && this.nullOption != null) {
        this.selectedIndex = null;
      }else {
        let index = this.options.findIndex((item: any) => getProperty(item, this.option.value) == this.model);
        
        //Para una buena experiencia de usuario, si el index no es encontrado
        //es porque el valor no existe en la lista o el modelo que recibimos es nulo.
        //Al ejecutarse esta opción y no tener una opción nula o no existente
        //el component se encarga de autocambiar el modelo vínculado a la primera
        //opción válida del select, emitiendo el valor que se encuentra en el primer
        //item de la lista
        if(index < 0) {
          //Emitir el modelo asícronamente del lifecycle para evitar error de
          //angular. A pesar de tener un tiempo de 0 milisegundos, el event loop
          //de JavaScript ejecutará esto hasta el puro final ya que es una operación
          //naturalmente asíncrona
          setTimeout(() => {
            this.onModelChange(0);
          }, 0);
        } else {
          this.selectedIndex = index;
        }
      }
    }
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

  public onModelChange(index: number) {
    this.selectedIndex = index;
    if(index != null) {
      this.modelChange.emit(getProperty(this.options[index], this.option.value));
    }else {
      this.modelChange.emit(null);
    } 
  }

  public toggle(open: boolean) {
    this.open = open;
  }

  public handleClickEvent(e: any, open: boolean) {
    e.preventDefault();
    e.target.focus();
    this.toggle(open);
  }

  public handleSelectEvent(e: any, open: boolean) {
    e.preventDefault();
    this.toggle(open);
  }

  public selectOption(e: any, index?: number) {
    e.stopPropagation();
    this.model = index != null ? this.options[index] : null;
    this.open = false;
    this.select.nativeElement.focus();
    this.onModelChange(index);
  }

  private recalculateResultsMaxHeight(): void {
    const binding = this.select.nativeElement.getBoundingClientRect();
    this.maxResultsHeight = window.innerHeight - binding.bottom - 10;
  }
}
