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
        return this.waitForRefresh(request, next);
      } else {
        return next.handle(request).pipe(
          catchError((error) => {
            if(error instanceof HttpErrorResponse && error.status == HttpStatusCode.Unauthorized) {
              if(error.headers.has(ResponseHeaders.ACCESS_TOKEN_EXPIRED)) {
                if(!this._refreshingToken) {
                  this._refreshingToken = new Subject();
                  return this.refreshSession(request, next);
                }
                
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
    return this.sessionService.refresh().pipe(
      switchMap((response) => {
        localStorage.setItem(StorageKeys.ACCESS_TOKEN, response.data.accessToken);
        localStorage.setItem(StorageKeys.REFRESH_TOKEN, response.data.refreshToken);
        
        this._refreshingToken.next(response.data);
        return this.retryRequest(request, next);
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
          return this.retryRequest(request, next, true);
        }

        throw new HttpErrorResponse({});
      })
    );
  }

  private retryRequest(request: HttpRequest<unknown>, next: HttpHandler, subject: boolean = false): Observable<HttpEvent<unknown>> {
    const updatedRequest = request.clone({
      headers: request.headers.set(RequestHeaders.AUTHORIZATION, `Bearer ${localStorage.getItem(StorageKeys.ACCESS_TOKEN)}`)
    });
    
    return next.handle(updatedRequest);
  }

  private logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
