import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  if (typeof window === 'undefined') {
    return true;
  }

  return localStorage.getItem('lyf_logged') === 'true';
};
