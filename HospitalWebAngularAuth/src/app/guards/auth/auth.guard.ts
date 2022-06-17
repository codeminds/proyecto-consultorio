import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { StorageKeys } from '@utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private router: Router) {}

  canActivateChild(): boolean {
    const isLoggedIn = localStorage.getItem(StorageKeys.ACCESS_TOKEN) != null;
    
    if(!isLoggedIn) {
      this.router.navigate(['login']);
    }

    return isLoggedIn;
  }
  
}
