import { AfterViewChecked, Component, DoCheck, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Console } from 'console';
import { BehaviorSubject, delay, Observable, of, ReplaySubject, take } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements AfterViewChecked, OnChanges, OnInit {
  @HostListener('window: resize')
  public onWindowResize() {
    //Refrescar el alto por cambios en el tamaño
    //de la ventana por el usuario
    this.refreshContentHeight();
  }
  
  @Input()
  public panelTitle?: string;

  @Input()
  public expandable?: boolean;

  @Input()
  public open?: boolean;

  @Input()
  public contentClass?: string;

  @Output()
  public openChange: EventEmitter<boolean>;

  @ViewChild('content')
  private content: ElementRef;

  public contentHeight: number;
  public afterAnimateOpen: boolean;
  
  private contentHeightNext: number;
  private contentHeightAnimated: boolean;
  private contentHeightTimeout: NodeJS.Timeout;
  private animatedOpenTimeout: NodeJS.Timeout;

  //Esta propiedad determina ciertos estilos en línea que
  //utilizamos para la animación del panel
  public get style(): string {
    let style;

    //Nada de esto es necesario si el panel no es expandible
    //ya que no tendría animación
    if(this.expandable) {
      style = '';
      if(this.open){
        style += `height: ${this.contentHeight / 10}rem;`;
      }

      if(this.contentHeightAnimated) {
        style += 'transition: height 0.4s ease-in-out 0.1s;';
      } 
    }

    return style;
  }

  constructor() { 
    this.panelTitle = null;
    this.expandable = false;
    this.open = false;
    this.contentClass = null;
    this.contentHeight = null;
    this.afterAnimateOpen = false;
    this.contentHeightNext = 0;
    this.contentHeightAnimated = false;
    this.contentHeightTimeout = null;
    this.animatedOpenTimeout = null;
    this.openChange = new EventEmitter();
  }

  public ngOnInit(): void {
      if(!this.expandable) {
        this.open = true;
        this.resolveOpen(this.open);
      }
  }

  public ngOnChanges(changes: SimpleChanges): void {
      //Sólo queremos que la animación suceda
      //al abrir o cerrar el panel y no por recálculos
      //por cambios de elementos o tamaños de pantalla
      if(changes.hasOwnProperty('open')) {
        this.resolveOpen(this.open);
      }
  }

  public ngAfterViewChecked(): void {
    //Refrescar el alto por cambios de elementos
    //internos al panel en angular
    this.refreshContentHeight();
  }

  public toggleOpen() {
    //Sólo queremos que la animación suceda
    //al abrir o cerrar el panel y no por recálculos
    //por cambios de elementos o tamaños de pantalla
    this.open = !this.open;
    this.resolveOpen(this.open);
    this.openChange.emit(this.open);
  }

  private resolveOpen(open: boolean) {
    this.contentHeightAnimated = true;
    if(open) {
      this.afterAnimateOpen = true;
      clearTimeout(this.animatedOpenTimeout);
    }else {
      this.animatedOpenTimeout = setTimeout(() => {
        this.afterAnimateOpen = false;
        this.animatedOpenTimeout = null;
      }, 500);
    }
  }

  //Cuando los paneles son expandibles utilizamos JS para calcular el alto del contenido para tener un tamaño 
  //preciso para la animación, sin embargo esto puede cambiar por muchas razones 
  //(e.g.: angular reevaluando nuevos elementos o el usuario modificando el tamaño de la ventana del explorador)
  private refreshContentHeight(): void {
    if(this.expandable) { 
      this.contentHeightNext = this.content?.nativeElement.offsetHeight;

      //para evitar cálculos constantes ya que angular liga muchos eventos que están constantemente
      //ejecutándose en la aplicación, creamos un nuevo cambio de altura para la animación sólo si
      //el nuevo alto del elemento ha cambiado en comparación con su altura anterior
      if(!this.contentHeightTimeout && this.contentHeight != this.contentHeightNext) {
        //Ejecutar el cambio asícronamente del lifecycle para evitar error de
        //angular. A pesar de tener un tiempo de 0 milisegundos, el event loop
        //de JavaScript ejecutará esto hasta el puro final ya que es una operación
        //naturalmente asíncrona. Guardando el timeout en una variable y
        //validando que este no sea nulo para ejecutarlo nos ayuda a
        //evitar que se ejecuten varios timeouts al mismo tiempo mientras
        //angular resuelve sus cálculos
        this.contentHeightTimeout = setTimeout(() => {
          this.contentHeight = this.contentHeightNext;
          if(this.contentHeightAnimated) {
            setTimeout(() => {
              this.contentHeightAnimated = false;
            }, 500);
          }
          
          //Asegurarse de hacer que la variable sea nula
          //luego de ejecutar el timeout o si no el chequeo
          //anterior en el if no permitirá futuros recálculos
          this.contentHeightTimeout = null; 
        }, 0);
      }
    }
  }
}
