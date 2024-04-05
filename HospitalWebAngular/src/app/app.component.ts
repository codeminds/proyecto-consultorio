import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Message, MessageType } from '@services/http/http.types';
import { SnackbarType } from '@shared/components/snackbar/snackbar.types';
import { filter, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Store } from '@store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public message$: Observable<Message>;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title
  ){}

  public ngOnInit(): void {
    this.message$ = this.store.siteMessage$;

    //Cuando el state de App cambia se modifica el título de la pestaña
    this.store.siteTitle$.subscribe((title) => {
      this.title.setTitle(`${title ? title + ' | ' : ''}Hospital Angular`);
    });

    this.router.events.pipe(
      //Obtiene un evento del router específico
      filter((e): e is RouterEvent => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      switch(e.constructor) {
        case NavigationEnd:
          //Angular empieza a funcionar desde su elemento raíz inicial,
          //esto implica que los elementos como body, head, title y demás
          //están fuera de su ecosistema, y deben ser accesados de manera nativa,
          //además este no navega entre archivos para ir a diferentes páginas, en vez cambiando
          //el HTML dinámicamente sin cargar de nuevo, esto es conocido como un "Single Page Application",
          //por estas razones hay que crear funcionalidad especial para cambiar el título
          //de la pestaña del browser con cada navegación 
          const routeData = this.getRouteData();
          this.store.siteTitle = routeData.title;
          break;
      }
    });
  }

  public getSnackbarType(type: MessageType): SnackbarType {
    switch(type) {
      case MessageType.Info:
        return SnackbarType.Info;
      case MessageType.Success:
        return SnackbarType.Success;
      case MessageType.Warning:
        return SnackbarType.Warning;
      case MessageType.Error:
        return SnackbarType.Danger;
      default:
        return SnackbarType.Neutral;
    }
  }

  public dismissMessage(): void {
    this.store.siteMessage = null;
  }

  private getRouteData(): Data {
    const data: Data = {};

    //Recolecta recursivamente los route data objects
    //de cada nivel de la ruta reemplazando los valores
    //de la misma propiedad priorizando el más bajo nivel
    let route = this.route.snapshot.firstChild;
    while(route?.firstChild) {
      route = route.firstChild;
      Object.assign(data, route.data);
    }

    return data;
  }
}
