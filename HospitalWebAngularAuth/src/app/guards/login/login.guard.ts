import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageKeys } from '@utils/constants';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedOut = localStorage.getItem(StorageKeys.ACCESS_TOKEN) == null;
    
    if(!isLoggedOut) {
      this.router.navigate(['']);
    }

    return isLoggedOut;
  }
  
}
