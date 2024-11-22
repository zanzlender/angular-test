import { inject, Injectable, signal } from '@angular/core';
import { LoggedInUser } from '../models/logged-in-user.model';
import { LocalStorageService } from './local-storage.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly currentUser = signal<LoggedInUser | undefined>(undefined);
  currentUser$ = toObservable(this.currentUser);

  setCurrentUser() {
    const productsString = this.localStorageService.getItem('auth_token');
    if (!productsString) {
      this.currentUser.set(undefined);
      return;
    }
    try {
      const user = JSON.parse(productsString) as LoggedInUser;
      this.currentUser.set(user);
    } catch (err) {
      this.currentUser.set(undefined);
    }
  }

  signInUser({ username, password }: { username: string; password: string }) {
    if (username === 'admin' && password === 'password') {
      const newUser: LoggedInUser = {
        id: '1',
        name: 'admin',
        token: 'valid-auth-token',
      };
      this.localStorageService.setItem('auth_token', JSON.stringify(newUser));
      this.currentUser.set(newUser);
      return true;
    }
    return false;
  }

  signOutUser() {
    this.localStorageService.removeItem('auth_token');
    this.currentUser.set(undefined);
    this.router.navigateByUrl('/');
  }
}
