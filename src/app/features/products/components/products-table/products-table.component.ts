import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Product } from '@/app/shared/models/product.model';
import { ProductsService } from '@/app/features/products/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteProductDialog } from '../delete-product-dialog/delete-product-dialog.component';
import { UpdateProductDialog } from '../update-product-dialog/update-product-dialog.component';
import { CurrentUserService } from '@/app/shared/services/current-user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyExchangeService } from '@/app/shared/services/currency-exchange.service';
import { combineLatestWith, Subscription } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'products-table',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
  ],
  providers: [ProductsService],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.css',
})
export class ProductsTableComponent implements AfterViewInit {
  readonly confirmDeleteDialog = inject(MatDialog);
  readonly updateProductDialog = inject(MatDialog);
  readonly productsService = inject(ProductsService);
  products$ = inject(ProductsService).products$;
  readonly currentUserService = inject(CurrentUserService);
  currencyExchange$ = inject(CurrencyExchangeService).currencyExchange$;
  private _snackBar = inject(MatSnackBar);
  isLoggedIn: boolean = false;
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = [
    'Id',
    'Name',
    'Price EUR',
    'Price USD',
    'Description',
    'Category',
  ];

  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor() {
    this.dataSource = new MatTableDataSource<Product>();
  }

  p: Product[] = [];
  private productSubscription: Subscription | undefined;

  ngOnInit() {
    this.products$
      .pipe(combineLatestWith(this.currencyExchange$))
      .subscribe(([products, currency]) => {
        this.dataSource.data = products.map((p) => {
          return {
            ...p,
            price_usd: (p.price * Number(currency?.quotes?.EURUSD)).toFixed(2),
          };
        });
      });

    this.currentUserService.currentUser$.subscribe((user) => {
      if (user !== undefined) {
        this.isLoggedIn = true;
        this.displayedColumns.push('Action');
      } else {
        this.isLoggedIn = false;
        this.displayedColumns.filter((item) => item !== 'Action');
      }
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.dataSource.sort.ngOnChanges;
    }
  }

  ngOnDestroy() {
    this.productSubscription?.unsubscribe();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openConfirmDeleteDialog(productId: number) {
    this.confirmDeleteDialog.open(ConfirmDeleteProductDialog, {
      width: '100%',
      maxWidth: '576px',
      data: {
        productId,
        action: () => {
          this.deleteProduct(productId);
          this._snackBar.open('Product deleted', 'Dismiss');
        },
      },
    });
  }

  openUpdateProductDialog(product: Product) {
    this.updateProductDialog.open(UpdateProductDialog, {
      width: '100%',
      maxWidth: '576px',
      data: {
        product,
        action: () => {
          this.updateProduct(product);
        },
      },
    });
  }

  deleteProduct(productId: number) {
    this.productsService.deleteProduct(productId);
    this.productsService.getProducts();
  }

  updateProduct(product: Product) {
    this.productsService.updateProduct(product);
    this.productsService.getProducts();
  }
}
