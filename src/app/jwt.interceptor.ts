import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtAuthService } from '../app/jwt-auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
