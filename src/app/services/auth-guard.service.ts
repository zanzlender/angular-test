import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { CurrentUserServiceService } from './current-user-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private currentUserService: CurrentUserServiceService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.currentUserService.currentUser$.pipe(
      filter((user) => user !== undefined),
      map((user) => {
        if (!user) {
          this.router.navigateByUrl('/');
          return false;
        }
        return true;
      })
    );
  }
}
