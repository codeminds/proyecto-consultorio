import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { catchError, Observable, ObservableInput, of, retryWhen, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, HttpMethod, Message, MessageType, QueryParams } from './http.types';

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

  public get(url: string, params: QueryParams = null, apiOverride: string = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.get<APIResponse>(`${apiOverride || environment.apiURL}/${url}${this.getQuery(params)}` , {
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
      catchError((response) => this.handleError(response, HttpMethod.GET))
    );
  }

  public post(url: string, data: any = null, params: QueryParams = null, apiOverride: string = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.post<APIResponse>(`${apiOverride || environment.apiURL}/${url}${this.getQuery(params)}`, data, {
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
      catchError((response) => this.handleError(response, HttpMethod.POST))
    );
  }

  public put(url: string, data: any = null, params: QueryParams = null, apiOverride: string = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.put<APIResponse>(`${apiOverride || environment.apiURL}/${url}${this.getQuery(params)}`, data, {
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
      catchError((response) => this.handleError(response, HttpMethod.PUT))
    );
  }

  public delete(url: string, params: QueryParams = null, apiOverride: string = null): Observable<APIResponse> {
    let retries = 0;
    return this.httpClient.delete<APIResponse>(`${apiOverride || environment.apiURL}/${url}${this.getQuery(params)}`, {
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

  private getQuery(params: QueryParams): string {
    let query = params ? '?' : '';

    for(const prop in params) {
      query += `${prop}=${params[prop] != null ? params[prop] : ''}&`;
    }

    return query;
  }
}
