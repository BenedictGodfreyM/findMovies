import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { PageTitleService } from './services';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor, headersInterceptor, httpCancelInterceptor } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: false }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      httpCancelInterceptor,
      headersInterceptor,
      errorInterceptor
    ])),
    provideAnimations(),
    {provide: TitleStrategy, useClass: PageTitleService}
  ]
};
