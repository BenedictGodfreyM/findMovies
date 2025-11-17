import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { BaseRouteReuseStrategy, provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy, CustomTitleStrategy } from '@/app/services';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor, headersInterceptor, httpCancelInterceptor } from '@/app/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: false }),
    provideRouter(routes,withComponentInputBinding()),
    provideHttpClient(withInterceptors([
      httpCancelInterceptor,
      headersInterceptor,
      errorInterceptor
    ])),
    provideAnimations(),
    {provide: TitleStrategy, useClass: CustomTitleStrategy},
    {provide: BaseRouteReuseStrategy, useClass: CustomRouteReuseStrategy}
  ]
};
