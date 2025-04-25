// interceptors/api-key.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError as observableThrow } from 'rxjs';
import { ConfigService } from './app/services/config.service';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const authReq = req.clone({
      setHeaders: { 'x-api-key': this.configService.apiKey },
    });

    return next.handle(authReq).pipe(
      retry(1),
      catchError(err => observableThrow(() => err))
    );
  }
}
