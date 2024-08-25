import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  var isUserAuthenticated = inject(AuthService).isUserLoggedIn;
  var router = inject(Router);
  var accessToken = localStorage.getItem('accestoken');
  
  if(isUserAuthenticated===true && accessToken!==null && accessToken.length>0){
    return true;
  }
  router.navigateByUrl('/login');
  return false;
};
