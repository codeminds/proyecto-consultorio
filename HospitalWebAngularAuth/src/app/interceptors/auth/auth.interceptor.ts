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
import { environment } from 'src/environments/environment';
import { SessionTokens } from '@services/session/session.model';
import { RequestHeaders, ResponseHeaders, StorageKeys } from '@utils/constants';
import { SessionService } from '@services/session/session.service';
import { Store } from '@store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private _refreshingToken: Subject<SessionTokens>;

  constructor(
    private sessionService: SessionService,
    private store: Store
  ) {
    this._refreshingToken = null;
  }

  //toda petición HTTP será interceptada y antes de ser enviada al servidor pasará
  //por esta función que se autoinyectará sobre la cadena de otros observables
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //La lógica de refrescado de tokens sólo debe aplicar sobre peticiones al API
    if(request.url.startsWith(environment.apiURL)) {
      //Si un refrescado está en progreso toda nueva petición debe ser agregada
      //a la cola de espera, excepto por la petición de refrescado en sí, de no ser
      //así se agrega esta también a la cola y nunca se resuelve dejando todo el sistema
      //enciclado
      if(this._refreshingToken && !request.headers.has(RequestHeaders.SESSION)) {
        return this.waitForRefresh(request, next);
      } else {
        //La petición se ejecuta, pero al encontrar un error se maneja por el pipe de error
        return next.handle(request).pipe(
          catchError((error) => {
            //Si la respuesta es un error de autorización manejamos una serie de condiciones
            if(error instanceof HttpErrorResponse && error.status == HttpStatusCode.Unauthorized) {
              //Si la respuesta contiene el encabezado de token de acceso expirado
              //se inicia la funcionalidad de refrescado
              if(error.headers.has(ResponseHeaders.ACCESS_TOKEN_EXPIRED)) {
                //Pueden haber varias peticiones volviendo al mismo tiempo cuando el token
                //expira, por lo que hay que cuidar que sólo una petición de refrescado sea
                //enviada ya que un token de refrescado se pueden una sola vez
                if(!this._refreshingToken) {
                  this._refreshingToken = new Subject();
                  return this.refreshSession(request, next);
                }
                
                //Si la petición fallida también tiene un token expirado y ya
                //se está ejecutando un refrescado se agrega un segundo intento
                //de la misma a la cola de espera en vez
                return this.waitForRefresh(request, next);
              }

              //Si la petición con error de autorización no contiene el encabezado de token expirado
              //esto significa que está no autorizado por otras razones y debe salir del sistema
              this.store.closeSession();
            }
    
            //Si el error recibido no es de autorización simplemente 
            //pasa directo a lanzar el error de manera normal
            throw error;
          })
        );
      }
    }

    //Si la petición no es hacia el API se maneja la petición sin modificaciones
    return next.handle(request);
  }

  private refreshSession(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.sessionService.refresh().pipe(
      switchMap((response) => {
        //Si se logra refrescar la sesión con nuevos tokens estos se reemplazan
        //en el almacenamiento local del explorador web y se reejecuta la petición
        if(response.success) {
          localStorage.setItem(StorageKeys.ACCESS_TOKEN, response.data.accessToken);
          localStorage.setItem(StorageKeys.REFRESH_TOKEN, response.data.refreshToken);
          
          //Antes de reintentar ejecutar la petición fallida con los nuevos tokens
          //se transmiten los nuevos tokens para que todas las peticiones en espera
          //se procedan a ejecutar o reintentar
          this._refreshingToken.next(response.data);
          return this.retryRequest(request, next);
        }
        
        //Si el refrescado falla se transmite una respuesta vacía
        //a las peticiones en espera para que procedan a ser
        //canceladas
        this._refreshingToken.next(null);
        this.store.closeSession();
        throw new Error('Sesión falló al refrescar');
      }),
      finalize(() => {
        //Al finalizar la gestión de refrescado (haya fallado o no)
        //se procede a liberar la cola de espera y se destruye
        this._refreshingToken.complete();
        this._refreshingToken = null;
      })
    );
  }

  private waitForRefresh(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //Se agrega una suscripción al Subject de refrescado
    //esperando a la siguiente transmisión de valores
    return this._refreshingToken.pipe(
      switchMap((tokens) => {
        //Si la transmisión devuelve nuevos tokens
        //válidos se intenta ejecutar la petición
        //en espera
        if(tokens) {
          return this.retryRequest(request, next);
        }

        //Si la respuesta está vacía es porque el refrescado
        //falló y no debe ejecutarse la petición
        throw new Error(`${request.url} cancelado`);
      })
    );
  }

  private retryRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //Se crea una copia de la petición original (haya sido ejecutada o no)
    //reemplazando el token anterior por el último token de acceso almacenado
    const updatedRequest = request.clone({
      headers: request.headers.set(RequestHeaders.AUTHORIZATION, `Bearer ${localStorage.getItem(StorageKeys.ACCESS_TOKEN)}`)
    });
    
    //Se ejecuta la petición actualizada
    return next.handle(updatedRequest);
  }
}
