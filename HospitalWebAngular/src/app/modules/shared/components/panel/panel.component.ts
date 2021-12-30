import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements AfterViewChecked, OnChanges {
  @HostListener('window: resize')
  public onWindowResize() {
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
  
  private contentHeightNext: number;
  private contentHeightAnimated: boolean;
  private contentHeightTimeout: NodeJS.Timeout;

  public get style(): string {
    let style;

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
      if(changes.open != null) {
        this.contentHeightAnimated = true;
      }
  }

  public ngAfterViewChecked(): void {
    this.refreshContentHeight();
  }

  public toggleOpen() {
    this.contentHeightAnimated = true;
    this.open = !this.open;
    this.openChange.emit(this.open);
  }

  private refreshContentHeight(): void {
    if(this.expandable) { 
      this.contentHeightNext = this.content.nativeElement.offsetHeight;
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
