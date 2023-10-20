import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoleApi } from '@api/role/role.api';
import { UserApi } from '@api/user/user.api';
import { FilterUserDTO } from '@api/user/user.dto';
import { User, Role } from '@api/user/user.model';
import { QueryParams, MessageType } from '@services/http/http.types';
import { InputType } from '@shared/components/form-field/form-field.types';
import { ModalSize, ModalPosition } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { UserRole } from '@utils/enums';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.css']
})
export class UsersPage implements OnInit, OnDestroy {
  public get modalTitle() {
    return this.user?.id ?  'Editar Usuario' : 'Nuevo Usuario';
  }

  public get confirmDelete(): boolean {
    return this.deleteId != null;
  }

  public get passwordConfirmed(): boolean {
    return this.password == this.confirmPassword;
  }

  public users: User[];
  public roles: Role[];
  public modalOpen: boolean;
  public panelOpen: boolean;
  public user: User;
  public originalUser: User;
  public password: string;
  public confirmPassword: string;
  public loading: boolean;
  public saving: boolean;
  public confirmOpen: boolean;
  public filter: QueryParams;
  public deleteId: number;
  public messages: string[];
  public loggedUser: User;

  public InputType = InputType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  public UserRole = UserRole;

  private _unsubscribe: Subject<void>;
  
  constructor(
    private userApi: UserApi,
    private roleApi: RoleApi,
    private store: Store
  ) { 
    this.users = [];
    this.roles = [];
    this.modalOpen = false;
    this.panelOpen = false;
    this.user = null;
    this.originalUser = null;
    this.loading = false;
    this.password = '';
    this.saving = false;
    this.messages = [];
    this.filter = new FilterUserDTO();
    this.loggedUser = new User();
    this._unsubscribe = new Subject();
  }

  public ngOnInit(): void {
    this.loadRoles();
    this.list();
    this.store.user$
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((user) => { 
        this.loggedUser = user;
      });
  }

  public ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  public async loadRoles(): Promise<void> {
    const response = await firstValueFrom(this.roleApi.list());
    if(response.success) {
      this.roles = response.data;
    }
  }

  public async list(): Promise<void> {
    if(!this.loading) {
      this.loading = true;

      const response = await firstValueFrom(this.userApi.list(this.filter));
      if(response.success) {
        this.users = response.data;
      }

      this.loading = false;
    }
  }

  public insertUpdate(data: unknown = null): void {
    this.user = new User(data);
    this.modalOpen = true;
  }

  public async saveUser(): Promise<void> {
    if(!this.saving) {
      this.saving = true;
        
      const isNew = this.user.id == null
      const response = await firstValueFrom(isNew ? this.userApi.insert(this.user, this.password) : this.userApi.update(this.user, this.password));  
      this.messages = [];
      
      if(response.success) {
        this.panelOpen = true;
        this.filter = new FilterUserDTO({ 
          email: response.data.email 
        });

        this.modalOpen = false;
        this.store.siteMessage = { type: MessageType.Success, text: response.messages[0] };
        this.list();
      }else if(response.messages.length > 0) {
        this.messages = response.messages;
      }

      this.saving = false;
    }
  }

  public async deleteUser(): Promise<void> {
    if(!this.saving) {
      this.saving = true;

      const response = await firstValueFrom(this.userApi.delete(this.deleteId));
      if(response.success) {
        this.store.siteMessage = { type: MessageType.Success, text: response.messages[0] };
        this.list();
      }else if(response.messages.length > 0) {
        this.store.siteMessage = { type: MessageType.Warning, text: response.messages[0] };
      }

      this.saving = false;
      this.deleteId = null;
    }
  }

  public onModalClose(): void {
    this.user = null;
    this.password = '';
    this.confirmPassword = '';
    this.messages = [];
  }

  public canUserEdit(user: User): boolean {
    return this.loggedUser.isSuperAdmin || !user.hasRoles([UserRole.Administrator]);
  }
}
