
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtAuthService } from './jwt-auth.service';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs/operators';

export const jwtGuard: CanActivateFn = (route, state) => {
  const auth = inject(JwtAuthService);
  const router = inject(Router);

  return auth.currentUser.pipe(
    take(1),
    map(user => {
      if (user) {
        return true; // User is logged in, allow access
      } else {
        console.log('Access denied');
        router.navigate(['/login']); // Redirect to login if not logged in
        return false; // User is not logged in, deny access
      }
    })
  );
};
