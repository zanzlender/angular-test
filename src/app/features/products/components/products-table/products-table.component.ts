import {
  AfterViewInit,
  Component,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
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
import {
  combineLatestWith,
  Observable,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DataSource } from '@angular/cdk/collections';
import { toSignal } from '@angular/core/rxjs-interop';

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

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

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

  ngOnDestroy() {
    this.productSubscription?.unsubscribe();
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
class ExampleDataSource extends MatTable<Product> {
  private _dataStream = new ReplaySubject<Product[]>();

  constructor(initialData: Product[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Product[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Product[]) {
    this._dataStream.next(data);
  }
}
