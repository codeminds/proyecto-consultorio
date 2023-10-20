import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackbarType } from './snackbar.types';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {
  @Input()
  public text: string;

  @Input()
  public type: SnackbarType;

  @Input()
  public timeout?: number;

  @Output()
  public onClose: EventEmitter<void>;

  public closeSnackbar: boolean;

  private snackbarTimeout: NodeJS.Timeout;

  constructor() { 
    this.text = null;
    this.type = null;
    this.timeout = null;
    this.closeSnackbar = false
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
}