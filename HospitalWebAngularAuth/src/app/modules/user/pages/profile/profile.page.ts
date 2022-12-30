import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@api/user/user.model';
import { InputType, ButtonType } from '@shared/components/form-field/form-field.types';
import { ModalSize, ModalPosition } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit, OnDestroy {
  public get passwordConfirmed(): boolean {
    return this.password == this.confirmPassword;
  }

  public user: User;
  public password: string;
  public confirmPassword: string;
  public loading: boolean;
  public saving: boolean;
  public confirmOpen: boolean;
  public messages: string[];

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public ButtonType = ButtonType;

  private unsubcribe: Subject<void>;

  constructor(
    private store: Store
  ) { 
    this.user = null;
    this.password = '';
    this.confirmPassword = '';
    this.loading = false;
    this.saving = false;
    this.confirmOpen = false;
    this.messages = [];
    this.unsubcribe = new Subject();
  }

  public ngOnInit(): void {
    this.store.$user
      .pipe(takeUntil(this.unsubcribe))
      .subscribe((user) => {
        //Creamos un nuevo objeto User para evitar que sea la misma referencia ya que
        //si es la misma cualquier cambio temporal en esta página se reflejará en el store
        //por ende modificando todas las instancias del usuario sin siquiera haber salvado
        this.user = new User(user);
      });
  }

  //Técnica de unsubscribe de observables en componentes para evitar
  //filtrado de memoria. Al destruir el componente enviamos un notificación
  //al Subject unsubscribe y todos los observables con un pipe "takeUntil(this.unsubscribe)"
  //en el componente se desuscriben y liberan esa memoria
  public ngOnDestroy(): void {
    this.unsubcribe.next();
    this.unsubcribe.complete();
  }

  public confirmSave(): void {
    if(this.password || this.user.email != this.store.user.email) {
      this.confirmOpen = true;
    } else {
      this.save();
    }
  }

  public async save(): Promise<void> {
  }
}
