import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from '@/app/shared/services/local-storage.service';
import { Product, ProductInsert } from '@/app/shared/models/product.model';

const LOCAL_STORAGE_PRODUCTS_KEY = 'products';

@Injectable({
  providedIn: 'root',
})
// TODO: switch to w/e fetching method
export class ProductsService {
  private localStorageService = inject(LocalStorageService);
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor() {
    this.getProducts();
  }

  getProducts(): void {
    const products = this.localStorageService.getItem(
      LOCAL_STORAGE_PRODUCTS_KEY
    );
    const productsData = (products ? JSON.parse(products) : []) as Product[];

    this.productsSubject.next(productsData);
  }

  createProduct(product: ProductInsert): void {
    const productsString = this.localStorageService.getItem(
      LOCAL_STORAGE_PRODUCTS_KEY
    );
    const products = (
      productsString ? JSON.parse(productsString) : []
    ) as Product[];

    const newId =
      products.reduce((prev, val) => {
        if (val.id > prev) {
          return val.id;
        }
        return prev;
      }, 1) + 1;

    products.push({
      ...product,
      id: newId,
    });
    this.localStorageService.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(products)
    );

    this.productsSubject.next(products);
  }

  updateProduct(product: Product): void {
    const productsString = this.localStorageService.getItem(
      LOCAL_STORAGE_PRODUCTS_KEY
    );
    const products = (
      productsString ? JSON.parse(productsString) : []
    ) as Product[];

    const index = products.findIndex((p) => p.id === product.id);
    if (index === -1) return;

    products[index] = product;

    this.localStorageService.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(products)
    );

    this.productsSubject.next([...products]);
  }

  deleteProduct(productId: number): void {
    const productsString = this.localStorageService.getItem(
      LOCAL_STORAGE_PRODUCTS_KEY
    );
    const products = (
      productsString ? JSON.parse(productsString) : []
    ) as Product[];

    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );

    this.localStorageService.setItem(
      LOCAL_STORAGE_PRODUCTS_KEY,
      JSON.stringify(updatedProducts)
    );

    this.productsSubject.next([...updatedProducts]);
  }

  deleteAllProducts() {
    this.localStorageService.removeItem(LOCAL_STORAGE_PRODUCTS_KEY);
    this.productsSubject.next([]);
  }
}
