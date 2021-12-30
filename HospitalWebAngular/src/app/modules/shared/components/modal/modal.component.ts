import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalSize } from './modal.types';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit{
  @Input()
  public open: boolean;

  @Input()
  public modalTitle?: string;

  @Input()
  public size?: ModalSize

  @Input()
  public transparent?: boolean

  @Input()
  public closeOnClickOutside?: boolean

  @Output()
  public openChange: EventEmitter<boolean>;

  constructor() {
    this.open = false;
    this.modalTitle = null;
    this.size = null;
    this.transparent = false;
    this.closeOnClickOutside = true;
    this.openChange = new EventEmitter();
  }

  public ngOnInit(): void {
    if(this.open == null) {
      throw new Error('Property open is required');
    }

  }

  public onOpenChange(value: boolean) {
    this.open = value;
    this.openChange.emit(value);
  }

  public onClickOutside() {
    if(this.closeOnClickOutside) {
      this.onOpenChange(false);
    }
  }
}
