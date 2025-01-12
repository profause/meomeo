import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-material-progress-dialog',
  templateUrl: './material-progress-dialog.component.html',
  styleUrls: ['./material-progress-dialog.component.css']
})

export class MaterialProgressDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MaterialProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  hideProgressDialog(): void {
    this.dialogRef.close();
  }

}
