import { Routes } from '@angular/router';
import { AuthGuardService } from '@/app/features/auth/services/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@/app/features/home/pages/home/home.component').then(
        (m) => m.HomePage
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@/app/features/auth/pages/login/login.component').then(
        (m) => m.LoginPage
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('@/app/features/products/pages/products/products.component').then(
        (m) => m.ProductsPage
      ),
  },
  // Since I used models instead of pages here is just for testing
  {
    path: 'private',
    loadComponent: () =>
      import('@/app/features/products/pages/products/products.component').then(
        (m) => m.ProductsPage
      ),
    canActivate: [AuthGuardService],
  },
];
