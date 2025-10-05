import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({setHeaders: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Headers': 'Accept, Content-Type, Origin',
    // 'Accept': 'application/json',
    // 'Content-Type': 'application/json',
  }}));
};