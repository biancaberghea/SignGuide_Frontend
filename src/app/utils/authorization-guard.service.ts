import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {

    if (this.auth.isAuthenticated() && (state.url.includes('login') || state.url.includes('signup'))) {
      return this.router.createUrlTree(['home/home']);
    }
    if (this.auth.isAuthenticated() && state.url.includes('home')) {
      return true;
    }

    if (!this.auth.isAuthenticated() && state.url.includes('login')) {
      return true;
    }

    if (!this.auth.isAuthenticated() && state.url.includes('signup')) {
      return true;
    }

    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['auth/login']);
    }
    return true;
  }


}
