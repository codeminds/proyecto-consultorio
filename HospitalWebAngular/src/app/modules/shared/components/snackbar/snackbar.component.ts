import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SnackbarType } from './snackbar.types';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit, AfterViewInit {
  @HostListener('window: resize')
  public onWindowResize() {
    this.refreshSnackbarWidth();
  }

  @Input()
  public text: string;

  @Input()
  public type: SnackbarType;

  @Input()
  public timeout?: number;

  @Output()
  public onClose: EventEmitter<void>;

  @ViewChild('snackbar')
  private snackbar: ElementRef;

  public closeSnackbar: boolean;
  public snackbarWidth: number;

  private snackbarWidthNext: number;
  private snackbarWidthTimeout: NodeJS.Timeout;
  private snackbarTimeout: NodeJS.Timeout;

  public get style(): string {
    return this.snackbarWidth ? `left: calc(50% - ${this.snackbarWidth / 2}px)` : null;
  }

  constructor() { 
    this.text = null;
    this.type = null;
    this.timeout = null;
    this.closeSnackbar = false
    this.snackbarWidth = null;
    this.snackbarWidthNext = null;
    this.snackbarWidthTimeout = null;
    this.onClose = new EventEmitter();
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
  }

  public ngAfterViewInit(): void {
      this.refreshSnackbarWidth();
  }
  
  public close(): void {
    this.closeSnackbar = true;
    if(this.timeout) {
      clearTimeout(this.snackbarTimeout);
      this.snackbarTimeout = null;
    }

    setTimeout(() => {
      this.text = null;
      this.type = null;
      this.timeout = null;
      this.onClose.emit();
    }, 800);
  }

  private refreshSnackbarWidth(): void {
    this.snackbarWidthNext = this.snackbar?.nativeElement.offsetWidth;
    if(!this.snackbarWidthTimeout && this.snackbarWidth != this.snackbarWidthNext) {
      this.snackbarWidthTimeout = setTimeout(() => {
        this.snackbarWidth = this.snackbarWidthNext;
        this.snackbarWidthTimeout = null; 
      }, 0);
    }
  }
}
