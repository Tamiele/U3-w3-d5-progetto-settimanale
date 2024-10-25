import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authSvc.authSubject$.pipe(
      switchMap((userAccessData) => {
        if (!userAccessData) {
          return next.handle(request);
        }
        const newRequest = request.clone({
          headers: request.headers.append(
            'Authorization',
            `Bearer ${userAccessData.accessToken}`
          ),
        });
        return next.handle(newRequest);
      })
    );
  }
}
