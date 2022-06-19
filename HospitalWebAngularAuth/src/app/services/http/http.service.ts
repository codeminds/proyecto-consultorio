import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { RequestHeaders, StorageKeys } from '@utils/constants';
import { catchError, Observable, ObservableInput, of, retryWhen, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, HttpOptions, MessageType, QueryParams } from './http.types';

@Injectable({
  providedIn: 'root'
})
export class HttpService{
  private readonly retryLimit: number;
  
  constructor(
    private httpClient: HttpClient,
    private appService: AppService
  ) {
    this.retryLimit = 3;
  }

  public get(url: string, options: HttpOptions = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.get<APIResponse<unknown>>(`${options?.apiUrl || environment.apiURL}/${url}?${this.getQuery(options?.params)}`, {
      headers: this.getHeaders(options)
    }).pipe(
      retryWhen(errors => errors.pipe(
        tap(error => {
          if(error.status != 0 || ++retries > this.retryLimit) {
            throw error;
          }
        })
      )),
      catchError((response) => this.handleError(response))
    );
  }

  public post(url: string, data: unknown, options: HttpOptions = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.post<APIResponse<unknown>>(`${options?.apiUrl || environment.apiURL}/${url}?${this.getQuery(options?.params)}`, data, {
      headers: this.getHeaders(options)
    }).pipe(
      retryWhen(errors => errors.pipe(
        tap(error => {
          if(error.status != 0 || ++retries > this.retryLimit) {
            throw error;
          }
        })
      )),
      catchError((response) => this.handleError(response))
    );
  }

  public put(url: string, data: unknown, options: HttpOptions = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.put<APIResponse<unknown>>(`${options?.apiUrl || environment.apiURL}/${url}?${this.getQuery(options?.params)}`, data, {
      headers: this.getHeaders(options)
    }).pipe(
      retryWhen(errors => errors.pipe(
        tap(error => {
          if(error.status != 0 || ++retries > this.retryLimit) {
            throw error;
          }
        })
      )),
      catchError((response) => this.handleError(response))
    );
  }

  public patch(url: string, data: unknown, options: HttpOptions = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.patch<APIResponse<unknown>>(`${options?.apiUrl || environment.apiURL}/${url}?${this.getQuery(options?.params)}`, data, {
      headers: this.getHeaders(options)
    }).pipe(
      retryWhen(errors => errors.pipe(
        tap(error => {
          if(error.status != 0 || ++retries > this.retryLimit) {
            throw error;
          }
        })
      )),
      catchError((response) => this.handleError(response))
    );
  }

  public delete(url: string, options: HttpOptions = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.delete<APIResponse<unknown>>(`${options?.apiUrl || environment.apiURL}/${url}?${this.getQuery(options?.params)}`, {
      headers: this.getHeaders(options)
    }).pipe(
      retryWhen(errors => errors.pipe(
        tap(error => {
          if(error.status != 0 || ++retries > this.retryLimit) {
            throw error;
          }
        })
      )),
      catchError((response) => this.handleError(response))
    );
  }

  private handleError(response: HttpErrorResponse): ObservableInput<APIResponse<null>> {
    if(response.error?.data) {
      console.error(`HTTP ${response.status} Response: ${JSON.stringify(response?.error?.data, null, 4)}`);
    }
  
    if (response.status == 0) {
      this.appService.siteMessage = { text: 'No se ha podido conectar al servidor', type: MessageType.Error };
    } else {
      console.log(response?.url, 'Showing errors', JSON.stringify(response?.error?.messages));
      const message = response.error?.messages[0];
      this.appService.siteMessage = { text: message != null ? message : 'Ha ocurrido un error inesperado del servidor', type: MessageType.Error };
    }

    return of({ httpStatusCode: response.status , success: false, messages: [], data: null });
  }

  private getHeaders(options?: HttpOptions): { [header: string]: string | string[] } {
    return {
      'Content-Type': 'application/json',
      ...options?.accessToken && { [RequestHeaders.AUTHORIZATION]: `Bearer ${localStorage.getItem(StorageKeys.ACCESS_TOKEN)}` },
      ...options?.refreshToken && { [RequestHeaders.SESSION]: `Bearer ${localStorage.getItem(StorageKeys.REFRESH_TOKEN)}` }
    };
  }

  private getQuery(params: QueryParams, prefix: string = null): string {
    let query = '';

    for(const prop in params) {
      const param = params[prop]; 

      if(Array.isArray(param)) {
        for(const value of param) {
          query += this.getQueryParam(prop, value, prefix);
          query += '&';          
        }
      } else if (param != null && typeof param === 'object' && !(param instanceof Date)) {
        query += this.getQuery(param, prop);
      } else {
        query += this.getQueryParam(prop, param, prefix);
        query += '&';
      }
    }

    return query;
  }

  private getQueryParam(prop: string, param: unknown, prefix?: string): string {
    prop = prefix == null ? prop : prefix + prop.capitalize();

    if(param == null){
      return `${prop}=`
    } else if(param instanceof Date) {
      return `${prop}=${param.toInputDateString()}`;
    } else {
      return `${prop}=${param}`
    } 
  }
}
