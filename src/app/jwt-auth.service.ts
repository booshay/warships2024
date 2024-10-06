import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from './_models/user';


@Injectable({
  providedIn: 'root'
})
export class JwtAuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, public router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  baseUrl = 'https://www.warshipapi.booshay.info/'

  register(username, password) {
    username = username.toLowerCase();
    return this.http.post<User>(this.baseUrl + "register", { user: username, pass: password })
      .pipe(catchError(this.handleError))
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user.user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.router.navigateByUrl('/mines');
        }
        return user;
      }));
  }

  login(username, password) {
    username = username.toLowerCase();
    console.log(username, password)
    return this.http.post<any>(this.baseUrl + "login", { user: username, pass: password })
      .pipe(catchError(this.handleError))
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user.user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.router.navigateByUrl('/mines');
        }
        return user;
      }));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}
