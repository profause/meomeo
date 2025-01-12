import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogOptions, DialogService, DialogButton } from '../../services/dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})

export class ConfirmDialogComponent implements OnInit, OnDestroy {

  public isLoading = false;
  observers = new Array<Subscription>();
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private dialogService:DialogService) { }

  ngOnInit() {
    
  }

  public cancel(): void {
    this.isLoading = false;
    this.dialogService.sendMessage({text:'cancel button clicked',button:DialogButton.cancel});
    this.dialogRef.close();
  }

  public ok(): void {
    this.isLoading = true;
    this.dialogService.sendMessage({text:'ok button clicked',button:DialogButton.ok});
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.observers.forEach(e => e.unsubscribe);
  }

}

