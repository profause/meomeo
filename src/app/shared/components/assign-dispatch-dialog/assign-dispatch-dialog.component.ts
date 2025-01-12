import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../../models/account.interface';
import { BackendService } from '../../services/backend.service';
import { DialogButton, DialogOptions, DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-assign-dispatch-dialog',
  templateUrl: './assign-dispatch-dialog.component.html',
  styleUrls: ['./assign-dispatch-dialog.component.scss']
})
export class AssignDispatchDialogComponent implements OnInit,OnDestroy {

  public isLoading = false;
  public accounts = new Array<Account>();
  public selectedAccount = null;
  private unSubscriptioNotifier = new Subject();
  constructor(public dialogRef: MatDialogRef<AssignDispatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private backend: BackendService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.backend.getAccountListByType('dispatch')
    .pipe(takeUntil(this.unSubscriptioNotifier))
    .subscribe({
      next: (actionArray) => {
        this.isLoading = false
        if (actionArray.length > 0) {
          let accounts = actionArray.map((item: { payload: { doc: { id: any; data: () => Account; }; }; }) => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data()
            } as Account
          })
          this.accounts = accounts;
          console.log(`${JSON.stringify(accounts)}`)
        }
      }
    })
  }

  public cancel(): void {
    this.isLoading = false;
    this.dialogService.sendMessage({ text: 'cancel button clicked', button: DialogButton.cancel });
    this.dialogRef.close();
  }

  public selectAccount(account) {
    this.selectedAccount = account
  }

  public confirm(): void {
    this.isLoading = true;
    this.dialogService.sendMessage({
      text: 'ok button clicked',
      button: DialogButton.ok,
      dispatchRider: this.selectedAccount
    });
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('')
    this.unSubscriptioNotifier.complete()
  }

}
