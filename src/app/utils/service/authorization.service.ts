import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { Role } from '../model/roles';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  userRoles$: Observable<Role[]>;

  private _userRolesSubject = new BehaviorSubject<Role[]>([]);

  constructor() {
    this.userRoles$ = this._userRolesSubject.asObservable();
  }

  getUserRoles(): Role[] {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded = jwtDecode<{ role: string }>(token); 

        if (decoded && decoded.role) {
          const role = decoded.role;
          const key = Object.keys(Role).find(key => Role[key as keyof typeof Role] === role);
          const userRole: Role | undefined = key ? Role[key as keyof typeof Role] : undefined;

          if (userRole) {
            this._userRolesSubject.next([userRole]);
            return [userRole];
          } else {
            console.error('Invalid role:', role);
          }
        } else {
          console.error('Decoded token or role property is undefined');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('Token not found in localStorage');
    }

    return [];
  }


  hasRoles(targetRoles: Role[]): Promise<boolean> {
    const userRoles: Role[] = this._userRolesSubject
      .getValue();
    return Promise.resolve(targetRoles.some((role) =>
      userRoles.includes(role)
    ));
  }
}
