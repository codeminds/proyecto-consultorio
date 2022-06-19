import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { catchError, Observable, ObservableInput, of, retryWhen, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, MessageType, QueryParams } from './http.types';

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

  public get(url: string, params: QueryParams = null, apiOverride: string = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.get<APIResponse<unknown>>(`${apiOverride || environment.apiURL}/${url}?${this.getQuery(params)}`, {
      headers: {
        'Content-Type': 'application/json'
      }
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

  public post(url: string, data: unknown = null, params: QueryParams = null, apiOverride: string = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.post<APIResponse<unknown>>(`${apiOverride || environment.apiURL}/${url}?${this.getQuery(params)}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
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

  public put(url: string, data: unknown = null, params: QueryParams = null, apiOverride: string = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.put<APIResponse<unknown>>(`${apiOverride || environment.apiURL}/${url}?${this.getQuery(params)}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
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

  public delete(url: string, params: QueryParams = null, apiOverride: string = null): Observable<APIResponse<unknown>> {
    let retries = 0;
    return this.httpClient.delete<APIResponse<unknown>>(`${apiOverride || environment.apiURL}/${url}?${this.getQuery(params)}`, {
      headers: {
        'Content-Type': 'application/json'
      }
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
      const message = response.error?.messages[0];
      this.appService.siteMessage = { text: message != null ? message : 'Ha ocurrido un error inesperado del servidor', type: MessageType.Error };
    }

    return of({ httpStatusCode: response.status , success: false, messages: [], data: null });
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
    prop = prefix == null ? prop : prefix + prop.capitalize();

    if(param == null){
      return `${prop}=&`
    } else if(param instanceof Date) {
      return `${prop}=${param.toInputDateString()}&`;
    } else {
      return `${prop}=${param}&`
    } 
  }
}
