import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalPosition, ModalSize } from './modal.types';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnChanges{
  @Input()
  public open: boolean;

  @Input()
  public modalTitle?: string;

  @Input()
  public size?: ModalSize

  @Input()
  public position?: ModalPosition;

  @Input()
  public transparent?: boolean

  @Input()
  public closeOnClickOutside?: boolean

  @Output()
  public openChange: EventEmitter<boolean>;

  @Output()
  public onClose: EventEmitter<void>;

  private clickedInside: boolean;

  constructor() {
    this.open = false;
    this.modalTitle = null;
    this.size = null;
    this.position = ModalPosition.Mid;
    this.transparent = false;
    this.closeOnClickOutside = true;
    this.clickedInside = false;
    this.openChange = new EventEmitter();
    this.onClose = new EventEmitter();
  }

  public ngOnInit(): void {
    if(this.open == null) {
      throw new Error('Property open is required');
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty('open') && !this.open) {
      this.emitClose();
    }
  }

  public emitClose(): void {
    //Esperar a la animación de desaparición
    setTimeout(() => {
      this.onClose.emit();
    }, 300);
  }

  //Cambia el valor temporalmente para evitar que se cierre el modal
  //sin evitar la propagación de eventos para otros listeners globales
  public onClickInside() {
    this.clickedInside = true;
  }

  public onClickOutside() {
    //Si el click vino de adentro del modal, este ignora el cerrar el mismo
    if(!this.clickedInside && this.closeOnClickOutside) {
      this.emitClose();
      this.open = false;
      this.openChange.emit(false);
    }

    //Después del chequeo reseteamos el valor para la evaluación de un nuevo click
    this.clickedInside = false;
  }
}
