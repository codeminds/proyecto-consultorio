import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { AppService } from '@services/app/app.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  public ngOnInit(): void {
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
          this.appService.setTitle(routeData.title);
          break;
      }
    });
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
