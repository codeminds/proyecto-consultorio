import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserApi } from '@api/user/user.api';
import { User } from '@api/user/user.model';
import { MessageType } from '@services/http/http.types';
import { InputType } from '@shared/components/form-field/form-field.types';
import { ModalSize, ModalPosition } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

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
  public messages: string[];

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;

  private unsubcribe: Subject<void>;

  constructor(
    private userApi: UserApi,
    private store: Store
  ) { 
    this.user = null;
    this.password = '';
    this.confirmPassword = '';
    this.saving = false;
    this.messages = [];
    this.unsubcribe = new Subject();
  }

  public ngOnInit(): void {
    this.store.user$
      .pipe(
        takeUntil(this.unsubcribe)
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

  public async saveUser(): Promise<void> {
    if(!this.saving) {
      this.saving = true;

      const response = await firstValueFrom(this.userApi.updateSelf(this.user, this.password));  
      this.messages = [];
      
      if(response.success) {
        this.store.siteMessage = { type: MessageType.Success, text: response.messages[0] };
        this.store.user = response.data;
        this.password = '';
        this.confirmPassword = '';
      }else if(response.messages.length > 0) {
        this.messages = response.messages;
      }

      this.saving = false;
    }
  }
}
