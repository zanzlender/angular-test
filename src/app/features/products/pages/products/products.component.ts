import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ProductsTableComponent } from '@/app/features/products/components/products-table/products-table.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddProductFormComponent } from '@/app/features/products/components/add-product-form/add-product-form.component';
import { CurrentUserService } from '@/app/shared/services/current-user-service.service';
import { ExportService } from '@/app/shared/services/export.service';
import { ProductsService } from '@/app/features/products/services/products.service';
import { combineLatestWith } from 'rxjs';
import { CurrencyExchangeService } from '@/app/shared/services/currency-exchange.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'products-page',
  imports: [ProductsTableComponent, MatButtonModule],
  providers: [ExportService],
  template: `
    <div class="w-full">
      <div class="flex gap-3 justify-between items-center mb-3">
        <p class="font-semibold text-2xl">Products</p>
        <div class="flex gap-3 items-center">
          <button mat-flat-button (click)="exportAsCSV()">Download CSV</button>
          @if (isLoggedIn()) {
          <button mat-flat-button (click)="openDialog()">Add product</button>
          }
        </div>
      </div>
      <products-table></products-table>
    </div>
  `,
})
export class ProductsPage {
  currentUser$ = inject(CurrentUserService).currentUser$;
  private readonly products$ = inject(ProductsService).products$;
  productsSignal = toSignal(this.products$);
  private readonly currencyExchange$ = inject(CurrencyExchangeService)
    .currencyExchange$;
  readonly dialog = inject(MatDialog);
  readonly exportService = inject(ExportService);

  isLoggedIn = signal<boolean>(false);
  isLogged = computed(() => {
    return true;
  });

  ngOnInit() {
    this.currentUser$.subscribe((user) => {
      if (user !== undefined) {
        this.isLoggedIn.set(true);
      } else {
        this.isLoggedIn.set(false);
      }
    });
  }

  openDialog() {
    this.dialog.open(AddProductDialog, {
      width: '100%',
      maxWidth: '576px',
    });
  }

  exportAsCSV() {
    this.products$.subscribe((p) => {});

    this.products$
      .pipe(combineLatestWith(this.currencyExchange$))
      .subscribe(([products, currency]) => {
        console.log('HSASKJDHGAS', products);
        const data = products.map((p) => {
          return {
            ...p,
            price_usd: (p.price * Number(currency?.quotes?.EURUSD)).toFixed(2),
          };
        });
        this.exportService.DownloadFile(data, 'products');
      });
  }
}

@Component({
  selector: 'add-product-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    AddProductFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title class="mb-2">Add new product</h2>
    <mat-dialog-content class="w-full">
      <add-product-form (submitEmitter)="executeAction()"></add-product-form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class AddProductDialog {
  constructor(private dialogRef: MatDialogRef<AddProductDialog>) {}

  executeAction() {
    this.dialogRef.close();
  }
}
