import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Product, ProductInsert } from '../models/product.model';
import { CurrencyExchangeService } from './currency-exchange.service';

const LOCAL_STORAGE_PRODUCTS_KEY = 'products';

@Injectable({
  providedIn: 'root',
})
// TODO: switch to w/e fetching method
export class ProductsService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private currencyExchangeService: CurrencyExchangeService
  ) {}

  getProducts(): Observable<Product[]> {
    const fetchProducts = new Promise<Product[]>((resolve, reject) => {
      try {
        const products = this.localStorageService.getItem(
          LOCAL_STORAGE_PRODUCTS_KEY
        );
        const productsData = (
          products ? JSON.parse(products) : []
        ) as Product[];

        resolve(productsData);
      } catch (err) {
        reject(err);
      }
    });

    const productsObservable = from(fetchProducts);
    return productsObservable;
  }

  createProduct(product: ProductInsert): Observable<Product> {
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

    return new Observable<Product>((observer) => {
      observer.next({
        ...product,
        id: newId,
      });
    });
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
  }
}
