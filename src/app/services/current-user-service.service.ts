import { Injectable } from '@angular/core';
import { LoggedInUser } from '../models/logged-in-user.model';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  constructor(private localStorageService: LocalStorageService) {}
  currentUser$ = new BehaviorSubject<LoggedInUser | undefined>(undefined);

  setCurrentUser() {
    const productsString = this.localStorageService.getItem('auth_token');
    if (!productsString) {
      this.currentUser$.next(undefined);
      return;
    }
    try {
      const user = JSON.parse(productsString) as LoggedInUser;
      this.currentUser$.next(user);
    } catch (err) {
      this.currentUser$.next(undefined);
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
      this.currentUser$.next(newUser);
      return true;
    }
    return false;
  }

  signOutUser() {
    this.localStorageService.removeItem('auth_token');
    this.currentUser$.next(undefined);
  }
}
