import { BehaviorSubject, Observable } from 'rxjs';

export class State<T extends object> {
  private _state: BehaviorSubject<T>;
  private _setFunction: (state: T) => void;

  public get $state(): Observable<T> {
    return this._state.asObservable();
  }

  public get state(): T {
    return this._state.getValue();
  }

  public set state(value: T) {
    if(this._setFunction) {
      this._setFunction(value);
    }
  
    this._state.next(value);
  }

  constructor(setFunction: (state: T) => void = null) { 
    this._state = new BehaviorSubject(null);
    this._setFunction = setFunction;
  }
}
