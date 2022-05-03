import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { getProperty } from '../form-field.helpers';
import { CompareOption } from '../form-field.types';

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
  public options: any[];

  @Input()
  public option?: CompareOption;

  @Input()
  public label?: string;

  @Input()
  public model?: boolean | string | number;

  @Input()
  public inline?: boolean;

  @Input()
  public nullOption?: string;

  @Output()
  public modelChange: EventEmitter<any>;

  public selectedIndex: number;

  public get name(){
    return `${this.form}${this.fieldName}`;
  }

  public getProperty = getProperty;

  constructor() { 
    this.fieldName = null;
    this.form = null;
    this.options = [];
    this.option = CompareOption.default;
    this.label = null;
    this.model = null;
    this.inline = false;
    this.nullOption = null;
    this.selectedIndex = null;
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

  //El modelo del radio es un número que es el índice de selección
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
        let index = this.options.findIndex((item: any) => getProperty(item, this.option.value) == getProperty(this.model, this.option.compare));
        
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

  public onModelChange(index?: number) {
    if(index != null) {
      this.modelChange.emit(getProperty(this.options[index], this.option.output));
    }else {
      this.modelChange.emit(null);
    } 
  }
}
