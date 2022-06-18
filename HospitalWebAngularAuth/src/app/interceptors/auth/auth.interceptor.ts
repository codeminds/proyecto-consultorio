import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpStatusCode,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(request.url.startsWith(environment.apiURL)) {
      return next.handle(request).pipe(
        catchError((error) => {
          if(error instanceof HttpErrorResponse && error.status == HttpStatusCode.Unauthorized) {
            if(!error.headers.has('Session-Expired')) {
              //Refresh functionality
            }

            localStorage.clear();
            this.router.navigate(['login']);
          }
  
          throw error;
        })
      );
    }
   
    return next.handle(request);
  }
}
