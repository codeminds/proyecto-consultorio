import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Message } from '@services/http/http.types';
import { State } from '@utils/state';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService extends State<AppSettings>{
  private _siteMessage: BehaviorSubject<Message>;

  public get $siteMessage(): Observable<Message> {
    return this._siteMessage.asObservable();
  }

  public set siteMessage(value: Message) {
    if(value != null && this._siteMessage != null) {
      this._siteMessage.next(null);
    }

    setTimeout(() => {
      this._siteMessage.next(value);
    }, 100);
  }

  constructor(
    private title: Title
  ) {
    //Cuando el state principal de AppService cambia se modifica el título de la pestaña
    super((state: AppSettings) => { this.title.setTitle(`Hospital Angular${state.title ? ' | ' + state.title : ''}`) });
    this._siteMessage = new BehaviorSubject(null);
  }
}
