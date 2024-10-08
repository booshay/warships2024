/* import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
 */

import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Allow login and register requests to pass through without adding a token
  if (req.url.endsWith('login') || req.url.endsWith('register')) {
    console.log('interceptor working')
    return next(req);
  }

  // Get currentUser from localStorage safely
  const currentUserString = localStorage.getItem('currentUser');
  let idToken: string | null = null;
  // Parse currentUser and check for the token
  if (currentUserString) {
    try {
      const currentUser = JSON.parse(currentUserString);
      idToken = currentUser?.token || null; // Safely access token if it exists
    } catch (e) {
      console.error('Error parsing currentUser from localStorage', e);
    }
  }

  // If no token is found, pass the request through as is
  if (!idToken) {
    return next(req);
  }

  // Clone the request and add the JWT token to the Authorization header
  const clonedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${idToken}`)
  });

  // Pass the cloned request with the JWT token
  return next(clonedRequest);
};
