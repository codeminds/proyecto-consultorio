import { Component, HostListener, OnInit } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { UserApi } from '@api/user/user.api';
import { User } from '@api/user/user.model';
import { Store } from '@store';
import { SessionApi } from '@api/session/session.api';

@Component({
  selector: 'app-main',
  templateUrl: './main.layout.html',
  styleUrls: ['./main.layout.css']
})
export class MainLayout implements OnInit {
  public menuOpen: boolean;
  public accountMenuOpen: boolean;
  public $siteTitle: Observable<string>;
  public $user: Observable<User>; 

  //Si se hace click en cualquier lugar del body
  //el menu se cierra
  @HostListener('body: click')
  public onBodyClick(): void {
    this.menuOpen = false;
    this.accountMenuOpen = false;
  }

  constructor(
    private store: Store,
    private userApi: UserApi,
    private sessionApi: SessionApi
  ) {
    this.menuOpen = false;
    this.accountMenuOpen = false;
  }

  public ngOnInit(): void {
    //Utilizamos los subjects de state management como observables
    //para aprovecha los "async pipes" y tener beneficios
    //como la auto-desuscripción de observables al destruir
    //el componente sin tener que hacer manualmente
    //Más info: https://medium.com/angular-in-depth/angular-question-rxjs-subscribe-vs-async-pipe-in-component-templates-c956c8c0c794
    this.$siteTitle = this.store.$siteTitle;
    this.$user = this.store.$user;

    if(this.store.user == null) {
      this.userApi.load();
    }
  }

  //El evento para abrir o cerrar cancela el event bubbling para evitar
  //que el host listener de body vuelva cambiar el menú
  public toggleMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  public toggleAccountMenu(): void {
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  public handleMenuNavigate(): void {
    console.log('clicked');
    this.menuOpen = false;
  }

  public async logout(): Promise<void> {
    const response = await firstValueFrom(this.sessionApi.logout());
    if(response.success) {
      this.store.closeSession();
    }
  }
}
