import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Product } from '@/app/shared/models/product.model';
import { UpdateProductFormComponent } from '../update-product-form/update-product-form.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'update-product-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    UpdateProductFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title class="mb-2">Update product</h2>
    <mat-dialog-content class="w-full">
      <update-product-form
        [product]="data.product"
        (submitEmitter)="executeAction()"
      ></update-product-form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
})
export class UpdateProductDialog {
  constructor(
    private dialogRef: MatDialogRef<UpdateProductDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      product: Product;
      action: (id: number) => void;
    }
  ) {}

  executeAction() {
    this.dialogRef.close();
  }
}
