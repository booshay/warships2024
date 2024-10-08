import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideToastr } from 'ngx-toastr';
import { jwtInterceptor } from './jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideToastr(), provideHttpClient(withInterceptors([jwtInterceptor])), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync()]
};
