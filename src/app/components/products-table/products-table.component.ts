import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  inject,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteProductDialog } from '../delete-product-dialog/delete-product-dialog.component';
import { UpdateProductDialog } from '../update-product-dialog/update-product-dialog.component';

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
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.css',
})
export class ProductsTableComponent implements AfterViewInit {
  readonly confirmDeleteDialog = inject(MatDialog);
  readonly updateProductDialog = inject(MatDialog);

  displayedColumns: string[] = [
    'Id',
    'Name',
    'Price',
    'Description',
    'Category',
    'Action',
  ];
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private productsService: ProductsService) {
    this.dataSource = new MatTableDataSource<Product>();
  }

  ngOnInit() {
    this.productsService.getProducts().subscribe((products) => {
      this.dataSource.data = products;
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
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
      data: { productId, action: () => this.deleteProduct(productId) },
    });
  }

  openUpdateProductDialog(product: Product) {
    this.updateProductDialog.open(UpdateProductDialog, {
      width: '100%',
      maxWidth: '576px',
      data: { product, action: () => this.updateProduct(product) },
    });
  }

  deleteProduct(productId: number) {
    this.productsService.deleteProduct(productId);
  }

  updateProduct(product: Product) {
    this.productsService.updateProduct(product);
  }
}
