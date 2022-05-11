import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EventsService } from '@shared/services/events/events.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements AfterViewChecked, OnChanges, OnInit, OnDestroy {
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
  private contentRef: ElementRef;

  public contentHeight: number;
  public afterAnimateOpen: boolean;
  
  private contentHeightNext: number;
  private contentHeightAnimated: boolean;
  private contentHeightTimeout: NodeJS.Timeout;
  private animatedOpenTimeout: NodeJS.Timeout;
  private animationTimeout: NodeJS.Timeout;
  private animationTiming: number;
  private animationTimingDelay: number;
  private animationTimingMs: number;
  private unsubscribe: Subject<void>;

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
        style += `transition: height ${this.animationTiming}s ease-in-out ${this.animationTimingDelay}s;`;
      } 
    }

    return style;
  }

  constructor(
    private eventsService: EventsService
  ) { 
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
    this.animationTimeout = null;
    this.animationTiming = 0.4;
    this.animationTimingDelay = 0.1;
    this.animationTimingMs = (this.animationTiming + this.animationTimingDelay) * 1000;
    this.openChange = new EventEmitter();
    this.unsubscribe = new Subject();
  }

  public ngOnInit(): void {
      if(!this.expandable) {
        this.open = true;
        this.animateOpen(this.open);
      }
  }

  public ngOnChanges(changes: SimpleChanges): void {
      //Sólo queremos que la animación suceda
      //al abrir o cerrar el panel y no por recálculos
      //por cambios de elementos o tamaños de pantalla
      if(changes.hasOwnProperty('open')) {
        this.animateOpen(this.open);
      }

      if(changes.hasOwnProperty('expandable')) {
        //Refrescar el alto por cambios en el tamaño
        //de la ventana por el usuario. Solo paneles expandibles
        //Utilizamos el servicio de eventos globales en vez de saturar el DOM
        //con eventos propios
        if(this.expandable) {
          this.eventsService.windowResize
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((e) => {
            this.refreshContentHeight();
          });
        } else {
          //El panel puede cambiar a ser expandible o no por medio de la
          //propiedad de input "expandable", por lo que que suscribimos o desuscribimos
          //al componente del evento global conforme sea necesario
          this.unsubscribe.next();
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

  public ngAfterViewChecked(): void {
    //Refrescar el alto por cambios de elementos
    //internos al panel en angular. Solo paneles expandibles
    if(this.expandable) {
      this.refreshContentHeight();
    }
  }

  public toggleOpen(): void {
    //Sólo queremos que la animación suceda
    //al abrir o cerrar el panel y no por recálculos
    //por cambios de elementos o tamaños de pantalla
    this.open = !this.open;
    this.animateOpen(this.open);
    this.openChange.emit(this.open);
  }

  private animateOpen(open: boolean): void {
    this.contentHeightAnimated = true;
    clearTimeout(this.animatedOpenTimeout);
    this.animatedOpenTimeout = setTimeout(() => {
      this.contentHeightAnimated = false;
      this.animatedOpenTimeout = null;
    }, this.animationTimingMs);

    if(open) {
      this.afterAnimateOpen = true;
      clearTimeout(this.animationTimeout);
    }else {
      this.animationTimeout = setTimeout(() => {
        this.afterAnimateOpen = false;
        this.animationTimeout = null;
      }, this.animationTimingMs);
    }
  }

  //Cuando los paneles son expandibles utilizamos JS para calcular el alto del contenido para tener un tamaño 
  //preciso para la animación, sin embargo esto puede cambiar por muchas razones 
  //(e.g.: angular reevaluando nuevos elementos o el usuario modificando el tamaño de la ventana del explorador)
  private refreshContentHeight(): void {
    this.contentHeightNext = this.contentRef?.nativeElement.offsetHeight;

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

        //Asegurarse de hacer que la variable sea nula
        //luego de ejecutar el timeout o si no el chequeo
        //anterior en el if no permitirá futuros recálculos
        this.contentHeightTimeout = null; 
      }, 0);
    }
  }
}
