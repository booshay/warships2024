import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { PsqlService } from './psql.service';
import { inject } from '@angular/core';
import { JwtAuthService } from './jwt-auth.service';

export const coordsResolverResolver: ResolveFn<any> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
    const dataService = inject(PsqlService);
    const auth = inject(JwtAuthService);

    return auth.currentUser.pipe(
      switchMap(user => {
        return dataService.getCoords("mines", user).pipe(
          catchError(error => of('no data'))
        );
      })
    );
  };
