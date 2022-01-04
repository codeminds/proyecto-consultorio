import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements AfterViewChecked, OnChanges {
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

  @Input('content-class')
  public contentClass?: string;

  @Output()
  public openChange: EventEmitter<boolean>;

  @ViewChild('content')
  private content: ElementRef;

  public contentHeight: number;
  
  private contentHeightNext: number;
  private contentHeightAnimated: boolean;
  private contentHeightTimeout: NodeJS.Timeout;

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
        style += `${this.contentHeightAnimated ? 'transition: height 0.4s ease-in-out 0.1s;' : ''}`;
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
    this.contentHeightNext = 0;
    this.contentHeightTimeout = null;
    this.openChange = new EventEmitter();
  }

  public ngOnChanges(changes: SimpleChanges): void {
      //Sólo queremos que la animación suceda
      //al abrir o cerrar el panel y no por recálculos
      //por cambios de elementos o tamaños de pantalla
      if(changes.open != null) {
        this.contentHeightAnimated = true;
      }
  }

  public ngAfterViewChecked(): void {
    //Refrescar el alto por cambios de elementos
    //internos al panel en angular
    this.refreshContentHeight();
  }

  public toggleOpen() {
    this.contentHeightAnimated = true;
    this.open = !this.open;
    this.openChange.emit(this.open);
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
        this.contentHeightTimeout = setTimeout(() => {
          this.contentHeight = this.contentHeightNext;
          this.contentHeightAnimated = false;
          this.contentHeightTimeout = null; 
        }, 0);
      }
    }
  }
}
