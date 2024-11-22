import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '@/app/features/products/services/products.service';
import { Product } from '@/app/shared/models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';

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
      class="w-full max-w-sm mx-auto px-6 py-8 flex flex-col items-center gap-2"
    >
      <h1 class="text-2xl font-semibold text-center mb-4">Seed data</h1>
      <p class="mb-6">To get some examples from the start you can</p>

      <button
        [disabled]="isLoading() && !isComplete()"
        class="w-full max-w-[200px]"
        mat-flat-button
        (click)="seedProducts()"
      >
        {{ isLoading() && !isComplete() ? 'Loading...' : 'Seed' }}
      </button>

      <p>COMP {{ products().length }}</p>
      <p>COMP {{ isComplete() }}</p>
      <p>LOAD {{ isLoading() }}</p>
    </div>
  `,
})
export class HomePage {
  private readonly productsService = inject(ProductsService);
  readonly numberOfProducts = 10;

  isLoading = signal(false);
  products = toSignal(this.productsService.products$, {
    initialValue: [] as Product[],
  });
  isComplete = computed(() => this.products().length >= this.numberOfProducts);

  constructor() {
    effect(() => {
      if (this.isComplete()) {
        this.isLoading.set(false);
      }
    });
  }

  seedProducts() {
    const products = GenerateProducts(this.numberOfProducts);
    this.isLoading.set(true);
    products.forEach((prod) => {
      this.productsService.createProduct(prod);
    });
  }
}

function GenerateProducts(number: number) {
  const categories = ['Electronics', 'Food', 'Furniture'];

  const products: Product[] = Array.from(Array(number).keys()).map((x) => {
    const randomCategory =
      categories[randomIntFromInterval(0, categories.length - 1)];
    const randomPrice = Number((Math.random() * 1000).toFixed());

    return {
      id: x,
      category: randomCategory,
      currency: 'EUR',
      description: 'This is a cool product',
      name: 'Product - ' + x,
      price: randomPrice,
    };
  });

  return products;
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
