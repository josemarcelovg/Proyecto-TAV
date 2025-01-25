import { CanActivateFn } from '@angular/router';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 
  return true;
};



export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
