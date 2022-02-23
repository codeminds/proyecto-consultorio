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

  constructor() {
    this.open = false;
    this.modalTitle = null;
    this.size = null;
    this.position = ModalPosition.Mid;
    this.transparent = false;
    this.closeOnClickOutside = true;
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

  public onClickOutside() {
    this.emitClose();
    this.open = false;
    this.openChange.emit(false);
  }
}
