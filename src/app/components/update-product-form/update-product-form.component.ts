import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

const CATEGORIES = ['Electronics', 'Food', 'Furniture'];

@Component({
  selector: 'update-product-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './update-product-form.component.html',
  styleUrl: './update-product-form.component.css',
})
export class UpdateProductFormComponent {
  constructor(
    private http: HttpClient,
    private productsService: ProductsService
  ) {}

  private _snackBar = inject(MatSnackBar);

  @Input() product: Product | undefined = undefined;
  @Output() submitEmitter: EventEmitter<void> = new EventEmitter<void>();

  categories: string[] = CATEGORIES;
  registerForm = new FormGroup({
    name: new FormControl(this.product?.name, [
      Validators.required,
      Validators.minLength(5),
    ]),
    price: new FormControl(this.product?.price, [
      Validators.required,
      Validators.min(1),
    ]),
    category: new FormControl(this.product?.category, [
      Validators.required,
      Validators.minLength(1),
    ]),
    description: new FormControl(this.product?.description),
  });

  ngOnInit() {
    this.registerForm.patchValue({
      name: this.product?.name,
      price: this.product?.price,
      category: this.product?.category,
      description: this.product?.description,
    });

    this.registerForm.events.subscribe((event) => {
      if (event instanceof FormSubmittedEvent) {
        if (this.registerForm.valid) {
          this.productsService.updateProduct({
            id: this.product?.id ?? 0,
            name: this.registerForm.value.name ?? '',
            price: this.registerForm.value.price ?? 0,
            category: this.registerForm.value.category ?? '',
            description: this.registerForm.value.description ?? '',
            currency: 'EUR',
          });
          this.submitEmitter.emit();
          this._snackBar.open('Product updated!', 'Dismiss', {
            duration: 2000,
          });
        }
      }
    });
  }
}
