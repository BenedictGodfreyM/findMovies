import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { HttpCancelService } from '../services';

@Injectable()
export class HttpCancelInterceptor implements HttpInterceptor {

  constructor(router: Router, private httpCancelService: HttpCancelService){
    router.events.subscribe(event => {
      if(event instanceof ActivationEnd){
        this.httpCancelService.cancelPendingRequests();
      }
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
  }
}
