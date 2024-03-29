import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.layout.html',
  styleUrls: ['./main.layout.css']
})
export class MainLayout implements OnInit {
  public menuOpen: boolean;
  public siteTitle$: Observable<string>; 

  //Si se hace click en cualquier lugar del body
  //el menu se cierra. El uso de HostListener no permite el uso
  //de la fase de captura y crea problemas de eficiencia
  @HostListener('body: click')
  public onBodyClick(): void {
    this.menuOpen = false;
  }

  constructor(
    private store: Store
  ) {
    this.menuOpen = false;
  }

  public ngOnInit(): void {
    //Utilizamos los subjects de state management como observables
    //para aprovecha los "async pipes" y tener beneficios
    //como la auto-desuscripción de observables al destruir
    //el componente sin tener que hacer manualmente
    //Más info: https://medium.com/angular-in-depth/angular-question-rxjs-subscribe-vs-async-pipe-in-component-templates-c956c8c0c794
    this.siteTitle$ = this.store.siteTitle$;
  }

  //El evento para abrir o cerrar cancela el event bubbling para evitar
  //que el host listener de body vuelva cerrar el menú
  public toggleMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  public handleMenuNavigate(): void {
    this.menuOpen = false;
  }
}
