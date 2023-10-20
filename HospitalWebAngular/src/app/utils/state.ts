import { BehaviorSubject, Observable } from 'rxjs';

export class State<T> {
  private _state: BehaviorSubject<T>;

  public get value$(): Observable<T> {
    return this._state.asObservable();
  }

  public set value(value: T) {
    this._state.next(value);
  }

  public get value() {
    return this._state.value;
  }

  constructor(initial: T = null) { 
    this._state = new BehaviorSubject(initial);
  }
}