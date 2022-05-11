import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { EventsService } from '@shared/services/events/events.service';
import { Subject, takeUntil } from 'rxjs';
import { SnackbarType } from './snackbar.types';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public text: string;

  @Input()
  public type: SnackbarType;

  @Input()
  public timeout?: number;

  @Output()
  public onClose: EventEmitter<void>;

  @ViewChild('snackbar')
  private snackbarRef: ElementRef;

  public closeSnackbar: boolean;
  public snackbarWidth: number;

  private snackbarWidthNext: number;
  private snackbarWidthTimeout: NodeJS.Timeout;
  private snackbarTimeout: NodeJS.Timeout;
  private unsubscribe: Subject<void>;

  //Basado en el ancho del contenido
  //calculamos el centro exacto en la pantalla
  //del snackbar
  public get style(): string {
    return this.snackbarWidth ? `left: calc(50% - ${this.snackbarWidth / 2}px)` : null;
  }

  constructor(
    private eventsService: EventsService
  ) { 
    this.text = null;
    this.type = null;
    this.timeout = null;
    this.closeSnackbar = false
    this.snackbarWidth = null;
    this.snackbarWidthNext = null;
    this.snackbarWidthTimeout = null;
    this.onClose = new EventEmitter();
    this.unsubscribe = new Subject();
  }

  public ngOnInit(): void {
    if(!this.text) {
      throw new Error('Property text is required');
    }

    if(!this.text) {
      throw new Error('Property type is required');
    }

    if(this.timeout) {
      this.snackbarTimeout = setTimeout(() => {
        this.close();
      }, this.timeout);
    }

    //Refrescar el ancho por cambios en el tamaño
    //de la ventana por el usuario definiendo el tamaño del elemento
    //Utilizamos el servicio de eventos globales en vez de saturar el DOM
    //con eventos propios
    this.eventsService.windowResize
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((e) => {
        this.refreshSnackbarWidth();
      });
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
      //Refrescar el ancho por contenido inicial
      //del snackbar definiendo el tamaño del elemento
      this.refreshSnackbarWidth();
  }
  
  public close(): void {
    this.closeSnackbar = true;

    //El usuario puede cerrar el snackbar antes de tiempo
    //por lo que queremos cancelar la funcionalidad a la 
    //espera del timeout y adelantar su ejecución
    if(this.timeout) {
      clearTimeout(this.snackbarTimeout);
      this.snackbarTimeout = null;
    }

    //Al cerrar queremos esperar 0.8 segundos
    //antes de cerrar el snackbar y elimintar su contenido
    //para darle tiempo a la animación de salida
    setTimeout(() => {
      this.text = null;
      this.type = null;
      this.timeout = null;
      this.onClose.emit();
    }, 800);
  }

  //Utilizamos JS para calcular el medio exacto en la pantalla del contenido 
  //acorde a su contenido, sin embargo esto puede cambiar por muchas razones 
  //(e.g.: angular reevaluando nuevos elementos o el usuario modificando el tamaño de la ventana del explorador)
  private refreshSnackbarWidth(): void {
    this.snackbarWidthNext = this.snackbarRef?.nativeElement.offsetWidth;

    //para evitar cálculos constantes ya que angular liga muchos eventos que están constantemente
    //ejecutándose en la aplicación, creamos un nuevo cambio de ancho para la animación sólo si
    //el nuevo ancho del elemento ha cambiado en comparación con su ancho anterior
    if(!this.snackbarWidthTimeout && this.snackbarWidth != this.snackbarWidthNext) {
      //Ejecutar el cambio asícronamente del lifecycle para evitar error de
      //angular. A pesar de tener un tiempo de 0 milisegundos, el event loop
      //de JavaScript ejecutará esto hasta el puro final ya que es una operación
      //naturalmente asíncrona. Guardando el timeout en una variable y
      //validando que este no sea nulo para ejecutarlo nos ayuda a
      //evitar que se ejecuten varios timeouts al mismo tiempo mientras
      //angular resuelve sus cálculos
      this.snackbarWidthTimeout = setTimeout(() => {
        this.snackbarWidth = this.snackbarWidthNext;

        //Asegurarse de hacer que la variable sea nula
        //luego de ejecutar el timeout o si no el chequeo
        //anterior en el if no permitirá futuros recálculos
        this.snackbarWidthTimeout = null; 
      }, 0);
    }
  }
}
