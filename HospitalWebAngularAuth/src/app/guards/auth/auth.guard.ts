import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router } from '@angular/router';
import { StorageKeys } from '@utils/constants';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = localStorage.getItem(StorageKeys.ACCESS_TOKEN) != null;
    const roles = route.data.roles as number[];

    if(!isLoggedIn) {
      this.router.navigate(['login']);
      return false;
    }

    return !roles || roles.includes(jwtDecode<any>(localStorage.getItem('access_token')).role_id);
  }
  
}
