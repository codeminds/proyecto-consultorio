import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@api/user/user.model';
import { InputType, ButtonType } from '@shared/components/form-field/form-field.types';
import { ModalSize, ModalPosition } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css']
})
export class ProfilePage implements OnInit, OnDestroy {
  public password: string;
  public confirmPassword: string;
  public loading: boolean;
  public saving: boolean;
  public messages: string[];
  public $user: Observable<User>;

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public ButtonType = ButtonType;

  private unsubscribe: Subject<void>;

  constructor(
    private store: Store
  ) { 
    this.password = null;
    this.loading = false;
    this.saving = false;
    this.messages = [];
    this.unsubscribe = new Subject();
  }

  public ngOnInit(): void {
    this.$user = this.store.$user;
  }

  //Técnica de unsubscribe de observables en componentes para evitar
  //filtrado de memoria. Al destruir el componente enviamos un notificación
  //al Subject unsubscribe y todos los observables con un pipe "takeUntil(this.unsubscribe)"
  //en el componente se desuscriben y liberan esa memoria
  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public async save(user: User): Promise<void> {
    console.log(user);
  }
}
