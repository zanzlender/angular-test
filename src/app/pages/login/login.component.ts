import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormSubmittedEvent,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrentUserService } from '../../services/current-user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div
      class="w-full max-w-sm mx-auto border rounded-md px-6 py-8 bg-gray-100"
    >
      <h1 class="text-2xl font-semibold text-center mb-6">Sign in</h1>
      <form [formGroup]="signInForm">
        <div class="flex flex-col gap-3">
          <mat-form-field class="example-full-width">
            <mat-label>Username</mat-label>
            <input id="username-input" matInput formControlName="username" />
            @if (signInForm.get("username")?.errors) {
            <mat-error>Username must be at least 5 characters long</mat-error>
            }
          </mat-form-field>
          <mat-form-field class="example-full-width">
            <mat-label>Passwrod</mat-label>
            <input
              id="password-input"
              type="password"
              matInput
              formControlName="password"
            />
            @if (signInForm.get("password")?.errors) {
            <mat-error>Password must be at least 5 characters long</mat-error>
            }
          </mat-form-field>

          <button mat-flat-button type="submit">Sign in</button>
        </div>
      </form>
    </div>
  `,
})
export class LoginPage {
  constructor(
    private currentUserService: CurrentUserService,
    private router: Router
  ) {}

  private _snackBar = inject(MatSnackBar);

  signInForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl('', [Validators.required, Validators.min(5)]),
  });

  ngOnInit() {
    if (this.currentUserService.currentUser$.value !== undefined) {
      this.router.navigateByUrl('/products');
    }

    this.signInForm.events.subscribe((event) => {
      if (event instanceof FormSubmittedEvent && this.signInForm.valid) {
        if (this.signInForm.valid) {
          const result = this.currentUserService.signInUser({
            password: this.signInForm.value.password ?? '',
            username: this.signInForm.value.username ?? '',
          });
          if (result === true) {
            this._snackBar.open('✅ Logged in', 'Dismiss');
            this.router.navigateByUrl('/products');
          } else {
            this._snackBar.open('❌ Invalid credentials', 'Dismiss');
          }
        } else {
          this._snackBar.open('❌ Invalid credentials', 'Dismiss');
        }
      }
    });
  }
}
