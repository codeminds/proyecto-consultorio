import { BehaviorSubject, Observable } from 'rxjs';

export class State<T> {
  private _state: BehaviorSubject<T>;

  public get value$(): Observable<T> {
    return this._state.asObservable();
  }

  public get value(): T {
    return this._state.getValue();
  }

  public set value(value: T) {
    this._state.next(value);
  }

  constructor() { 
    this._state = new BehaviorSubject(null);
  }
}