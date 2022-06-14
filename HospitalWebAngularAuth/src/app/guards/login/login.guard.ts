import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedOut = localStorage.getItem('accessToken') == null;
    
    if(!isLoggedOut) {
      this.router.navigate(['']);
    }

    return isLoggedOut;
  }
  
}
