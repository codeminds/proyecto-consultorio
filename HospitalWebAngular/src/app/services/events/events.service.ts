import { Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';

@Injectable({
  providedIn: 'platform'
})
export class EventsService {
  public bodyClick: Subject<Event>;
  public windowResize: Subject<Event>;

  //Utilizamos este servicio para tener un gestor de eventos globales
  //sobre el documento y mandar señales con Subjects de RxJS en vez.
  //Los eventos del DOM pueden ser operaciones muy pesadas, ya que muchos
  //componentes visuales reutilizables tienen una replica de dichos eventos por cada uno que se necesita.
  //Cada nueva iteración de un componente que registra un evento por HostListener es un nuevo event listener,
  //lo que causaría una saturación de eventos en el DOM.
  //Por medio de RxJS en vez registramos un evento único en el DOM y utilizamos Subjects para esparcir notificación
  //de este evento con una unidad lógica más liviana que son los observables.
  //Por último nos aseguramos de utilizar la captura de evento en vez de la burbuja para evitar que elementos que
  //cancelen la burbuja para tener funcionalidad especial (e.g.: el modal que se cierra al hacer click afuera) no eviten
  //que este evento llegue a la funcionalidad global de elementos internos
  constructor() {
    this.bodyClick = new Subject();
    fromEvent(document.body, 'click', { capture: true }).subscribe((e) => {
      this.bodyClick.next(e);
    });

    this.windowResize = new Subject();
    fromEvent(window, 'resize', { capture: true }).subscribe((e) => {
      this.windowResize.next(e);
    });
  }
}
