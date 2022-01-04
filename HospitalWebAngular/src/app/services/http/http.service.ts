import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '@services/app/app.service';
import { catchError, Observable, ObservableInput, of, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse, HttpMethod, Message, MessageType, QueryParams } from './http.types';

@Injectable({
  providedIn: 'root'
})
export class HttpService{ 
  constructor(
    private httpClient: HttpClient,
    private appService: AppService
  ) { }

  public get(url: string, params: QueryParams = null, api: string = null): Observable<APIResponse> {
    return this.httpClient.get<APIResponse>(`${api || environment.apiURL}/${url}${this.getQuery(params)}` , {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      retry(3),
      catchError((response) => this.handleError(response, HttpMethod.GET))
    );
  }

  public post(url: string, data: any = null, params: QueryParams = null, api: string = null): Observable<APIResponse> {
    return this.httpClient.post<APIResponse>(`${api || environment.apiURL}/${url}${this.getQuery(params)}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      retry(3),
      catchError((response) => this.handleError(response, HttpMethod.POST))
    );
  }

  public put(url: string, data: any = null, params: QueryParams = null, api: string = null): Observable<APIResponse> {
    return this.httpClient.put<APIResponse>(`${api || environment.apiURL}/${url}${this.getQuery(params)}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      retry(3),
      catchError((response) => this.handleError(response, HttpMethod.PUT))
    );
  }

  public delete(url: string, params: QueryParams = null, api: string = null): Observable<APIResponse> {
    return this.httpClient.delete<APIResponse>(`${api || environment.apiURL}/${url}${this.getQuery(params)}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      retry(3),
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
        message.text = 'You are not authorized to perform this action';
        break;
      case HttpStatusCode.Unauthorized:
        message.text = 'You are not authenticated or your session has expired. Please login to continue';
        break;
      default:
        message.text = `An error occured while ${method == HttpMethod.GET ? 'retrieving your data' : 'processing your request'}`;
        break;
    }

    this.appService.siteMessage = message;
    return of(null);
  }

  private getQuery(params: QueryParams): string {
    let query = params ? '?' : '';

    for(const prop in params) {
      query += `${prop}=${params[prop]}&`;
    }

    return query;
  }
}
