import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Message } from '@services/http/http.types';
import { State } from '@shared/utils/state';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from './app.settings';

@Injectable({
  providedIn: 'root'
})
export class AppService extends State<AppSettings>{
  private _siteMessage: BehaviorSubject<Message>;
  private _siteMessageInterval: NodeJS.Timeout;

  public get $siteMessage(): Observable<Message> {
    return this._siteMessage.asObservable();
  }

  public set siteMessage(value: Message) {
    this._siteMessage.next(value);
    
    if(this._siteMessageInterval != null) {
      clearInterval(this._siteMessageInterval);
      this._siteMessageInterval = null;
    }

    if(value != null) {
      this._siteMessageInterval = setInterval(() => {
        this._siteMessage.next(null);
        this._siteMessageInterval = null;
      }, 5000);
    }
  }

  constructor(
    private title: Title
  ) {
    //Cuando el state principal de AppService cambia se modifica el título de la pestaña
    super((state: AppSettings) => { this.title.setTitle(`Hospital Angular${state.title ? ' | ' + state.title : ''}`) });
    this._siteMessage = new BehaviorSubject(null);
    this._siteMessageInterval = null;
  }
}
