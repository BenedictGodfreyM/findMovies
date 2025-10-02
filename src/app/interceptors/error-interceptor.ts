import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, retry, throwError, timer } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount: number) => timer(1000),
    }),
    catchError((errorResponse: HttpErrorResponse) => {
      if([500, 503, 504].includes(errorResponse.status)) return throwError(() => errorResponse);
      
      if([401].includes(errorResponse.status)){
        snackBar.open('Session expired! Login again to continue.', '', { duration: 3000 });
        return throwError(() => errorResponse);
      }

      // Empty array to store cummulated errors
      var cummulatedErrors = new Array<string>();

      // Return Custom error if 403 Forbidden response is returned from the API
      if([403].includes(errorResponse.status)){
        snackBar.open('Forbidden Request!. The server cannot handle your request.', '', { duration: 3000 });
        return throwError(() => errorResponse);
      }
      // Chech if the error object is present in the request
      if(errorResponse.error){
        // Push the main error messages to the array of cummulated errors
        if(typeof(errorResponse.error.message) !== "undefined") cummulatedErrors.push(errorResponse.error.message);
        if(typeof(errorResponse.statusText) !== "undefined") cummulatedErrors.push(errorResponse.statusText);
        // Check for Laravel form validation error messages object
        if(errorResponse.error.errors){
          // For each error property (which is a form field)
          for(let property in errorResponse.error.errors){
            if(errorResponse.error.errors.hasOwnProperty(property)){
              // Extract its array of errors
              let propertyErrors: Array<string> = errorResponse.error.errors[property];
              // Push all errors in the array to the errors array
              propertyErrors.forEach(error => cummulatedErrors.push(error));
            }
          }
          console.info(cummulatedErrors);
        }else if(errorResponse.error.error){
          // Push authentication error messages
          cummulatedErrors.push(errorResponse.error.error);
        }
      }else{
        snackBar.open(errorResponse.message, '', { duration: 3000 });
        return throwError(() => errorResponse);
      }
      if(cummulatedErrors){
        if(typeof cummulatedErrors === "object"){
          cummulatedErrors.forEach(message => {
            if(typeof message !== "undefined"){
              snackBar.open(message, '', { duration: 6000 });
            }
          });
        }else{
          snackBar.open(cummulatedErrors, '', { duration: 6000 });
        }
      }
      return throwError(() => errorResponse);
    }
  ));
};
