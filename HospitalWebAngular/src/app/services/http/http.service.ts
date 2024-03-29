import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@store';
import { RequestHeaders } from '@utils/constants';
import { catchError, delay, finalize, Observable, ObservableInput, of, retryWhen, tap, timeout, TimeoutError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, HttpOptions, MessageType, QueryParams } from './http.types';

@Injectable({
  providedIn: 'root'
})
export class HttpService{
  private readonly _retryLimit: number;
  private readonly _retryCodes: number[];
  private readonly _takingLongSeconds: number;
  
  constructor(
    private httpClient: HttpClient,
    private store: Store
  ) {
    this._retryLimit = 2;
    this._retryCodes = [0, HttpStatusCode.BadGateway, HttpStatusCode.ServiceUnavailable, HttpStatusCode.GatewayTimeout];
    this._takingLongSeconds = 10;
  }

  public get(url: string, options: HttpOptions = {}): Observable<APIResponse<unknown>> {
    const takingLong = this.setTakingLongTimeout();
    
    return this.httpClient.get<APIResponse<unknown>>(`${environment.apiURL}/${url}?${this.getQuery(options?.params)}`, {
      headers: this.getHeaders()
    }).pipe(
      timeout((this._takingLongSeconds / 2) * 3 * 1000),
      retryWhen(error => this.retryRequest(error)),
      catchError((error) => this.handleError(error)),
      finalize(() => { clearTimeout(takingLong) })
    );
  }

  public post(url: string, data: unknown = null, options: HttpOptions = {}): Observable<APIResponse<unknown>> {
    const takingLong = this.setTakingLongTimeout();

    return this.httpClient.post<APIResponse<unknown>>(`${environment.apiURL}/${url}?${this.getQuery(options?.params)}`, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout((this._takingLongSeconds / 2) * 3 * 1000),
      retryWhen(error => this.retryRequest(error)),
      catchError((error) => this.handleError(error)),
      finalize(() => { clearTimeout(takingLong) })
    );
  }

  public put(url: string, data: unknown = null, options: HttpOptions = {}): Observable<APIResponse<unknown>> {
    const takingLong = this.setTakingLongTimeout();

    return this.httpClient.put<APIResponse<unknown>>(`${environment.apiURL}/${url}?${this.getQuery(options?.params)}`, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout((this._takingLongSeconds / 2) * 3 * 1000),
      retryWhen(error => this.retryRequest(error)),
      catchError((error) => this.handleError(error)),
      finalize(() => { clearTimeout(takingLong) })
    );
  }

  public delete(url: string, options: HttpOptions = {}): Observable<APIResponse<unknown>> {
    const takingLong = this.setTakingLongTimeout();

    return this.httpClient.delete<APIResponse<unknown>>(`${environment.apiURL}/${url}?${this.getQuery(options?.params)}`, {
      headers: this.getHeaders()
    }).pipe(
      timeout((this._takingLongSeconds / 2) * 3 * 1000),
      retryWhen(error => this.retryRequest(error)),
      catchError((error) => this.handleError(error)),
      finalize(() => { clearTimeout(takingLong); })
    );
  }

  private setTakingLongTimeout(): NodeJS.Timeout {
    return setTimeout(() => {
      this.store.siteMessage = { text: 'La acción está tardando, por favor espere...', type: MessageType.Warning };
    }, this._takingLongSeconds * 0.75 * 1000);
  }

  private retryRequest(error: Observable<any>): Observable<any> {
    let retries = 0;
    let takingLong: NodeJS.Timeout[] = [];

    return error.pipe(
      tap(error => {
        if(retries > 0) {
          takingLong.push(this.setTakingLongTimeout());
        } 
        
        if(!(error instanceof HttpErrorResponse) || !this._retryCodes.includes(error.status) || ++retries > this._retryLimit) {
          throw error;
        }  
      }),
      delay((this._takingLongSeconds / 2) * 1000),
      finalize(() => { takingLong.forEach(clearTimeout); })
    );
  }

  private handleError(error: Error): ObservableInput<APIResponse<null>> {
    if(error instanceof HttpErrorResponse) {
      console.warn(`HttpService ${error.status}: ${JSON.stringify(error.error.data, null, 4)}`);
    
      if (error.status == 0) {
        this.store.siteMessage = { text: 'No se ha podido conectar al servidor', type: MessageType.Error };
      } else {
        this.store.siteMessage = { text: error.error.messages[0] || 'Ha ocurrido un error inesperado del servidor', type: MessageType.Error };
      }

      return of({ httpStatusCode: error.status , success: false, messages: [], data: null });
    } else if (error instanceof TimeoutError) {
      this.store.siteMessage = { text: 'No se ha podido conectar al servidor', type: MessageType.Error };
    }

    console.warn(`HttpService: ${JSON.stringify(error.message, null, 4)}`);
    return of({ httpStatusCode: null, success: false, messages: [], data: null });
  }

  private getHeaders(): { [header: string]: string | string[] } {
    return {
      [RequestHeaders.CONTENT_TYPE]: 'application/json'
    };
  }

  private getQuery(params: QueryParams, prefix: string = null): string {
    let query = '';

    for(const prop in params) {
      const param = params[prop];

      if(Array.isArray(param)) {
        for(const value of param) {
          query += this.getQueryParam(prop, value, prefix);
        }
      } else if (param != null && typeof param === 'object' && !(param instanceof Date)) {
        query += `${!query ? '' : '&'}${this.getQuery(param, prop)}`;
      } else {
        query += this.getQueryParam(prop, param, prefix);
      }
    }

    return query;
  }

  private getQueryParam(prop: string, param: unknown, prefix?: string): string {
    prop = prefix != null ? `${prefix}.${prop}` : prop;

    if(param == null){
      return `${prop}=&`
    } else if(param instanceof Date) {
      return `${prop}=${param.toInputDateString()}&`;
    } else {
      return `${prop}=${param}&`
    } 
  }
}
