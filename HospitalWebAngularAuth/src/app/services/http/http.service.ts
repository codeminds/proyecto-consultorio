import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { catchError, Observable, ObservableInput, of, retryWhen, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, HttpMethod, HttpOptions, Message, MessageType, QueryParams } from './http.types';

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
      catchError((response) => this.handleError(response, HttpMethod.GET))
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
      catchError((response) => this.handleError(response, HttpMethod.POST))
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
      catchError((response) => this.handleError(response, HttpMethod.PUT))
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
      catchError((response) => this.handleError(response, HttpMethod.PUT))
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
      catchError((response) => this.handleError(response, HttpMethod.DELETE))
    );
  }

  private handleError(response: HttpErrorResponse, method: HttpMethod): ObservableInput<APIResponse> {
    const message: Message = {
      text: '',
      type: MessageType.Error
    }

    if(response.error?.messages) {
      for(const message of response.error.messages) {
        console.error(`HTTP Response: ${message}`);
      }
    }
  
    switch(response?.status) {
      case HttpStatusCode.Forbidden:
        message.text = 'No está autorizado para realizar esta acción';
        break;
      case HttpStatusCode.Unauthorized:
        message.text = 'No está autenticado o su sesión ha expirado. Por favor ingresar de nuevo';
        break;
      default:
        message.text = `Ha ocurrido un error ${method == HttpMethod.GET ? 'obteniendo los datos' : 'procesando los datos'}`;
        break;
    }

    this.appService.siteMessage = message;
    return of(null);
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
