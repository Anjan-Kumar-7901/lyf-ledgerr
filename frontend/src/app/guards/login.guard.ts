import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (typeof window === 'undefined') {
    return true;
  }

  const logged = localStorage.getItem('lyf_logged');

  if (logged && logged === 'true') {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
