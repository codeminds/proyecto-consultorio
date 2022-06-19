import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpStatusCode,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, Subject, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SessionTokens } from '@services/session/session.model';
import { RequestHeaders, ResponseHeaders, StorageKeys } from '@utils/constants';
import { SessionService } from '@services/session/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private _refreshingToken: Subject<SessionTokens>;

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {
    this._refreshingToken = null;
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.startsWith(environment.apiURL)) {
      if(this._refreshingToken && !request.headers.has(RequestHeaders.SESSION)) {
        console.log(request.url, 'waiting for token refresh');
        return this.waitForRefresh(request, next);
      } else {
        console.log(request.url, 'executing', request.headers.get('Authorization')?.substring(request.headers.get('Authorization').length - 4, request.headers.get('Authorization').length));
        return next.handle(request).pipe(
          catchError((error) => {
            if(error instanceof HttpErrorResponse && error.status == HttpStatusCode.Unauthorized) {
              console.log(request.url, 'unauthorized');
              if(error.headers.has(ResponseHeaders.ACCESS_TOKEN_EXPIRED)) {
                console.log(request.url, 'token expired');
                if(!this._refreshingToken) {
                  console.log(request.url, 'refreshing session');
                  this._refreshingToken = new Subject();
                  return this.refreshSession(request, next);
                }
                
                console.log(request.url, 'refreshing session to retry');
                return this.waitForRefresh(request, next);
              }

              this.logout();
            }
    
            throw error;
          })
        );
      }
    }

    return next.handle(request);
  }

  private refreshSession(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request.url, 'calling refresh');
    return this.sessionService.refresh().pipe(
      switchMap((response) => {
        console.log(request.url, 'refresh back');
        localStorage.setItem(StorageKeys.ACCESS_TOKEN, response.data.accessToken);
        localStorage.setItem(StorageKeys.REFRESH_TOKEN, response.data.refreshToken);
        
        this._refreshingToken.next(response.data);
        return next.handle(this.getUpdatedRequest(request));
      }),
      catchError((error) => {
        this._refreshingToken.next(null);
        this.logout();
        throw error;
      }),
      finalize(() => {
        this._refreshingToken.complete();
        this._refreshingToken = null;
      })
    );
  }

  private waitForRefresh(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this._refreshingToken.pipe(
      switchMap((tokens) => {
        if(tokens) {
          return next.handle(this.getUpdatedRequest(request));
        }

        console.log(request.url, 'cancelled');
        throw new HttpErrorResponse({});
      })
    );
  }

  private getUpdatedRequest(request: HttpRequest<unknown>): HttpRequest<unknown> {
    console.log(request.url, 'setting new authorization', localStorage.getItem(StorageKeys.ACCESS_TOKEN).substring(localStorage.getItem(StorageKeys.ACCESS_TOKEN).length - 4, localStorage.getItem(StorageKeys.ACCESS_TOKEN).length));
    //Esta línea está causando un error al intentar clonar (Meter en un try catch para ver qué es)
    const updatedRequest = request.clone({
      setHeaders: {
        ...request.headers,
        [RequestHeaders.AUTHORIZATION]: `Bearer ${localStorage.getItem(StorageKeys.ACCESS_TOKEN)}`
      }
    });
    console.log(updatedRequest.url, 'executing after refresh', updatedRequest.headers.get('Authorization')?.substring(updatedRequest.headers.get('Authorization').length - 4, updatedRequest.headers.get('Authorization').length));
    return updatedRequest;
  }

  private logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
