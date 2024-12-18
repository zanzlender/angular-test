import { Component, inject } from '@angular/core';
import { CurrentUserService } from '@/app/shared/services/current-user-service.service';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'header-component',
  imports: [RouterModule],
  template: `
    <header class="w-full flex h-20 items-center justify-center border-b">
      <div
        class="w-full max-w-7xl h-full px-3 xl:px-0 mx-auto flex items-center justify-between"
      >
        <h1 class="text-3xl font-bold">LOGO</h1>

        <nav class="flex flex-row gap-6 justify-between items-center">
          <a
            routerLink="/"
            routerLinkActive="active"
            ariaCurrentWhenActive="page"
            class="text-lg font-semibold hover:cursor-pointer"
            >Home</a
          >
          <a
            routerLink="/products"
            routerLinkActive="active"
            ariaCurrentWhenActive="page"
            class="text-lg font-semibold hover:cursor-pointer"
            >Products</a
          >
          @if (currentUser() !== undefined) {
          <a
            routerLinkActive="active"
            ariaCurrentWhenActive="page"
            class="text-lg font-semibold hover:cursor-pointer"
            (click)="Logout()"
            >Logout</a
          >
          }@else {
          <a
            routerLink="/login"
            routerLinkActive="active"
            ariaCurrentWhenActive="page"
            class="text-lg font-semibold hover:cursor-pointer"
            >Login</a
          >
          }
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private currentUserService = inject(CurrentUserService);
  currentUser = toSignal(this.currentUserService.currentUser$);

  Logout() {
    this.currentUserService.signOutUser();
  }
}
