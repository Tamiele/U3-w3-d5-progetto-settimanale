import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { iAccess } from '../interfaces/i-access';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { iUser } from '../interfaces/i-user';
import { iLoginRequest } from '../interfaces/i-login-request';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  jwtHelper: JwtHelperService = new JwtHelperService();

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  authSubject$ = new BehaviorSubject<iAccess | null>(null);

  user$: Observable<iUser | undefined> = this.authSubject$.asObservable().pipe(
    tap((accessData) => (this.isLoggedIn = !!accessData)),
    map((accessData) => accessData?.user)
  );

  isLoggedIn$ = this.authSubject$.pipe(map((accessData) => !!accessData));

  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  register(newUser: Partial<iUser>) {
    return this.http.post<iAccess>(this.registerUrl, newUser);
  }

  login(authenticationData: iLoginRequest) {
    return this.http.post<iAccess>(this.loginUrl, authenticationData).pipe(
      tap((accessData) => {
        console.log('Dati di accesso ricevuti:', accessData);
        this.authSubject$.next(accessData);

        localStorage.setItem('accessData', JSON.stringify(accessData));

        const tokenDate = this.jwtHelper.getTokenExpirationDate(
          accessData.accessToken
        );

        if (!tokenDate) return;

        this.autoLogout(tokenDate);
      })
    );
  }

  logout() {
    this.authSubject$.next(null);
    localStorage.removeItem('accessData');
    this.router.navigate(['/authentication/login']);
  }

  autoLogoutTimer: any;

  autoLogout(tokenDate: Date) {
    const tokenMs = tokenDate.getTime() - new Date().getTime();

    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, tokenMs);
  }

  restoreUser() {
    const userJson: string | null = localStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: iAccess = JSON.parse(userJson);

    if (this.jwtHelper.isTokenExpired(accessData.accessToken)) {
      localStorage.removeItem('accessData');
      return;
    }
    console.log('Utente trovato:', accessData.user);
    this.authSubject$.next(accessData);
  }
}
