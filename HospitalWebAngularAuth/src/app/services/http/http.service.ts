import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '@services/app/app.service';
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

  public get(url: string, options: HttpOptions = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.get<APIResponse>(`${options?.apiUrl || environment.apiURL}/${url}${this.getQuery(options?.params)}`, {
      headers: this.getHeaders(options?.authorize)
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

  public post(url: string, data: any, options: HttpOptions = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.post<APIResponse>(`${options?.apiUrl || environment.apiURL}/${url}${this.getQuery(options?.params)}`, data, {
      headers: this.getHeaders(options?.authorize)
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

  public put(url: string, data: any, options: HttpOptions = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.put<APIResponse>(`${options?.apiUrl || environment.apiURL}/${url}${this.getQuery(options?.params)}`, data, {
      headers: this.getHeaders(options?.authorize)
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

  public patch(url: string, data: any, options: HttpOptions = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.patch<APIResponse>(`${options?.apiUrl || environment.apiURL}/${url}${this.getQuery(options?.params)}`, data, {
      headers: this.getHeaders(options?.authorize)
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

  public delete(url: string, options: HttpOptions = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.delete<APIResponse>(`${options?.apiUrl || environment.apiURL}/${url}${this.getQuery(options?.params)}`, {
      headers: this.getHeaders(options?.authorize)
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

  private handleError(response: HttpErrorResponse): ObservableInput<APIResponse> {
    if(response.error?.data) {
      console.error(`HTTP ${response.status} Response: ${JSON.stringify(response?.error?.data, null, 4)}`);
    }
  
    if (response.status == 0) {
      this.appService.siteMessage = { text: 'No se ha podido conectar al servidor', type: MessageType.Error };
    } else {
      this.appService.siteMessage = { text: response.error?.messages[0] || 'Ha ocurrido un error inesperado del servidor', type: MessageType.Error };
    }

    return of({ httpStatusCode: response.status , success: false, messages: [], data: null });
  }

  private getHeaders(authorize: boolean): { [header: string]: string | string[] } {
    return {
      'Content-Type': 'application/json',
      ...authorize && { 'Authorization': localStorage.getItem('accessToken') }
    };
  }

  private getQuery(params: QueryParams): string {
    let query = params ? '?' : '';

    for(const prop in params) {
      const param = params[prop];

      if(Array.isArray(param)) {
        for(const value of param) {
          query += this.getQueryParam(prop, value);
        }
      } else {
        query += this.getQueryParam(prop, param);
      }
    }

    return query;
  }

  private getQueryParam(prop: string, param: any): string {
    if(param == null){
      return `${prop}=&`
    } else if(param instanceof Date) {
      return `${prop}=${param.toInputDateString()}&`;
    } else {
      return `${prop}=${param}&`
    } 
  }
}
