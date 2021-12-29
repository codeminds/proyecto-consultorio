import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent {
  @Input()
  public title?: string;

  @Input()
  public expandable?: boolean;

  @Input()
  public open?: boolean;

  @Output()
  public openChange: EventEmitter<boolean>;

  constructor() { 
    this.title = null;
    this.expandable = false;
    this.open = false;
    this.openChange = new EventEmitter();
  }
  
  public toggleOpen() {
    this.open = !this.open;
    this.openChange.emit(this.open);
  }
}
