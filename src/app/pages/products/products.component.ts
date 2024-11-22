import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { ProductsTableComponent } from '../../components/products-table/products-table.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddProductFormComponent } from '../../components/add-product-form/add-product-form.component';

@Component({
  selector: 'products-page',
  imports: [ProductsTableComponent, MatButtonModule],
  template: `
    <div class="w-full">
      <div class="flex gap-3 justify-between items-center mb-3">
        <p class="font-semibold text-2xl">Products</p>
        <button mat-flat-button (click)="openDialog()">Add product</button>
      </div>

      <products-table></products-table>
    </div>
  `,
})
export class ProductsPage {
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(AddProductDialog, {
      width: '100%',
      maxWidth: '576px',
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
