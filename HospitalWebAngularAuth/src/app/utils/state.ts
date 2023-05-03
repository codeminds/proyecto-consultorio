import { Observable, ReplaySubject } from 'rxjs';

export class State<T> {
  private _state: ReplaySubject<T>;

  public get value$(): Observable<T> {
    return this._state.asObservable();
  }

  public set value(value: T) {
    this._state.next(value);
  }

  constructor() { 
    this._state = new ReplaySubject();
  }
}