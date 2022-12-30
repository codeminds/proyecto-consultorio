import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserApi } from '@api/user/user.api';
import { User } from '@api/user/user.model';
import { APIResponse, MessageType } from '@services/http/http.types';
import { InputType, ButtonType } from '@shared/components/form-field/form-field.types';
import { ModalSize, ModalPosition } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { filter, forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';

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
  public saving: boolean;
  public confirmOpen: boolean;
  public messages: string[];

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public ButtonType = ButtonType;

  private unsubcribe: Subject<void>;

  constructor(
    private userApi: UserApi,
    private store: Store
  ) { 
    this.user = null;
    this.password = '';
    this.confirmPassword = '';
    this.saving = false;
    this.confirmOpen = false;
    this.messages = [];
    this.unsubcribe = new Subject();
  }

  public ngOnInit(): void {
    this.store.$user
      .pipe(
        takeUntil(this.unsubcribe),
        //Con este pipe de RxJS ignoramos en la suscripción la emisión de valores
        filter((user) => user != null)
      )
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
      this.saveChanges();
    }
  }

  public async saveChanges(): Promise<void> {
    if(!this.saving) {
      const actions: Observable<APIResponse<User>>[] = [];
      this.saving = true;

      if(this.user.firstName != this.store.user.firstName || this.user.lastName != this.store.user.lastName) {
        actions.push(this.userApi.patchInfo(this.user));
      } else {
        actions.push(of(null));
      }
  
      if(this.user.email != this.store.user.email) {
        actions.push(this.userApi.patchEmail(this.user));
      } else {
        actions.push(of(null));
      }
  
      if(this.password && this.password == this.confirmPassword) {
        actions.push(this.userApi.patchPassword(this.password));
      } else {
        actions.push(of(null));
      }

      forkJoin(actions).subscribe(([info, email, password]) => {
        console.log(info, email, password);
        this.messages = [];
        const messages = [];
        const user = new User(this.store.user);
        let success = true;
        let logout = false;

        if(info?.success) {
          user.firstName = info.data.firstName;
          user.lastName = info.data.lastName;
        } else if(info) {
          success = false;
          messages.push(...info.messages);
        }

        if(email?.success) {
          logout = true;
          user.email = email.data.email;
        } else if(email) {
          success = false;
          messages.push(...email.messages);
        }

        if(password?.success) {
          logout = true;
          this.password = '';
          this.confirmPassword = '';
        } else if(password) {
          success = false;
          messages.push(...password.messages);
        }

        if(success) {
          this.store.siteMessage = { type: MessageType.Success, text: 'Usuario actualizado' };

          if(logout) {
            setTimeout(() => {
              this.store.siteMessage = { type: MessageType.Info, text: 'Por favor reingrese con su nuevos credenciales' };
              this.store.closeSession();
            }, 2500);
          }
        }else {
          this.store.siteMessage = { type: MessageType.Warning, text: 'Algunos cambios no fueron guardados' };
        }

        this.messages = messages;
        this.store.user = user;
        this.saving = false;
        this.confirmOpen = false;
      })
    }
  }
}
