import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormSubmittedEvent,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../../services/products.service';

const CATEGORIES = ['Electronics', 'Food', 'Furniture'];
const CURRENCIES = ['EUR', 'USD'];

@Component({
  selector: 'add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrl: './add-product-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class AddProductFormComponent {
  constructor(
    private http: HttpClient,
    private productsService: ProductsService
  ) {}

  @Output() submitEmitter: EventEmitter<void> = new EventEmitter<void>();

  categories: string[] = CATEGORIES;
  acceptedCurrencies: string[] = CURRENCIES;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    category: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    description: new FormControl(''),
    currency: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.registerForm.events.subscribe((event) => {
      if (event instanceof FormSubmittedEvent && this.registerForm.valid) {
        this.productsService.createProduct({
          name: this.registerForm.value.name ?? '',
          price: this.registerForm.value.price ?? 0,
          category: this.registerForm.value.category ?? '',
          description: this.registerForm.value.description ?? '',
          currency: this.registerForm.value.currency ?? '',
        });
        this.submitEmitter.emit();
      }
    });
  }
}
