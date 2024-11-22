import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProductsPage } from './pages/products/products.component';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginPage } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'products',
    component: ProductsPage,
  },
  {
    path: 'private',
    component: ProductsPage,
    canActivate: [AuthGuardService],
  },
];
