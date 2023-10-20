import { Component, OnInit } from '@angular/core';
import { Session } from '@api/session/session.model';
import { SessionApi } from '@api/session/session.api';
import { MessageType, QueryParams } from '@services/http/http.types';
import { DateType, InputType } from '@shared/components/form-field/form-field.types';
import { ModalPosition, ModalSize } from '@shared/components/modal/modal.types';
import { Store } from '@store';
import { firstValueFrom } from 'rxjs';
import { FilterSessionDTO } from '@api/session/session.dto';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html'
})
export class SessionsPage implements OnInit{
  public get confirmDelete(): boolean {
    return this.deleteId != null;
  }

  public sessions: Session[];
  public currentSession: string;
  public panelOpen: boolean;
  public loading: boolean;
  public saving: boolean;
  public filter: QueryParams;
  public deleteId: string;
  public messages: string[];

  public InputType = InputType;
  public DateType = DateType;
  public ModalSize = ModalSize;
  public ModalPosition = ModalPosition;
  
  constructor(
    private sessionApi: SessionApi,
    private store: Store
  ) { 
    this.sessions = [];
    this.currentSession = null;
    this.panelOpen = false;
    this.currentSession = null;
    this.loading = false;
    this.saving = false;
    this.messages = [];
    this.filter = new FilterSessionDTO();
  }

  public ngOnInit(): void {
    this.currentSession = this.store.session;
    this.list();
  }

  public async list(): Promise<void> {
    if(!this.loading) {
      this.loading = true;

      const response = await firstValueFrom(this.sessionApi.list(this.filter));
      if(response.success) {
        const currentSessionIndex = response.data.findIndex((session) => session.sessionId == this.currentSession);
        const currentSession = response.data.splice(currentSessionIndex, 1);
        this.sessions = [...currentSession, ...response.data];
      }

      this.loading = false;
    }
  }

  public async deleteSession(): Promise<void> {
    if(!this.saving) {
      this.saving = true;

      const response = await firstValueFrom(this.sessionApi.logout(this.deleteId));
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
}