import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService, DialogButton } from '../../services/dialog.service';

@Component({
  selector: 'app-material-alert-dialog',
  templateUrl: './material-alert-dialog.component.html',
  styleUrls: ['./material-alert-dialog.component.scss']
})
export class MaterialAlertDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MaterialAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService:DialogService) { }

  ngOnInit() {
  }

  hideAlertDialog(): void {
    this.dialogRef.close();
  }

  public ok(): void {
    this.dialogService.sendMessage({text:'ok button clicked',button:DialogButton.ok});
    this.dialogRef.close();
  }

}
