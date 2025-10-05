import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { takeUntil } from 'rxjs';
import { HttpCancelService } from '@/app/services';
import { ActivationEnd, Router } from '@angular/router';

export const httpCancelInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const httpCancelService = inject(HttpCancelService);
  router.events.subscribe(event => {
    if(event instanceof ActivationEnd) httpCancelService.cancelPendingRequests();
  });
  return next(req).pipe(takeUntil(httpCancelService.onCancelPendingRequests()));
};
