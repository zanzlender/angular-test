import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'confirm-delete-product-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title class="mb-2">Confirm delete</h2>
    <mat-dialog-content class="w-full">
      Deleting a product is irreversible. Do you want to delete it?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="true" (click)="executeAction()">
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDeleteProductDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productId: number;
      action: (id: number) => void;
    }
  ) {}

  executeAction() {
    this.data.action(this.data.productId);
  }
}
