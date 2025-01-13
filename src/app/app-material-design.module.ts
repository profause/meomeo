
import { NgModule } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialProgressDialogComponent } from './shared/components/material-progress-dialog/material-progress-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { finalize, interval, Observable, of, scan, take } from 'rxjs';
import { DialogOptions, DialogService, DialogType } from './shared/services/dialog.service';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { AlertService, AlertType } from './shared/services/alert.service';
import { MaterialAlertDialogComponent } from './shared/components/material-alert-dialog/material-alert-dialog.component';



const materialDesignComponents = [
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatRadioModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
];
@NgModule({
    imports: [materialDesignComponents],
    exports: [materialDesignComponents]
})
export class AppMaterialDesignModule {
    private dialogRef!: MatDialogRef<any>;
    private alertDialogRef!: MatDialogRef<any>;
    constructor(public matDialog: MatDialog,
        public dialogService: DialogService,
        public alertService: AlertService) { }

    showProgressDialog(title: string): MatDialogRef<any> {
        this.dialogRef = this.matDialog.open(MaterialProgressDialogComponent, {
            width: '380px',
            height: '80px',
            data: { dialogTitle: title },
            disableClose: true,
            autoFocus: true
        });
        //console.log('this.dialogRef.getState '+this.dialogRef.getState);
        this.dialogRef.afterClosed().subscribe(result => {
            console.log('The progress dialog was closed');
        });

        return this.dialogRef;
    }

    public updateProgressDialogTitle(title: string) {
        this.dialogRef.componentInstance.data = { dialogTitle: title }
    }

    hideProgressDialog(): void {
        if (undefined != this.dialogRef)
            this.dialogRef.close();
    }

    
    openDialog(dialogToOpen, dialogOptions?: DialogOptions): Observable<any> {
        const dialogRef = this.matDialog.open(dialogToOpen, {
            width: dialogOptions.width || '250px',
            data: dialogOptions,
            disableClose: true,
            autoFocus: false,
            maxHeight:'90vh'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
        return this.dialogService.getMessage();
    }

    public showAlertToaster(type: AlertType, message: string, duration: number = 4): Observable<any> {
        //console.log('show this message : ' + message);
        //console.log('start the countdown : ' + duration);
        const counter$ = interval(1000);
        const numberOfSeconds = duration;
        //return
        this.alertService.showAlert(type,message);
        counter$.pipe(
            scan((accumulator, _current) => accumulator - 1, numberOfSeconds + 1),
            take(numberOfSeconds + 1),
            finalize(() => {
                //console.log('dismiss alert toaster')
                this.alertService.dismissAlert();
            })
        ).subscribe()

        return of(null)
    }

    showAlertDialog(type: DialogType, title: string, message: string): Observable<any> {
        this.alertDialogRef = this.matDialog.open(MaterialAlertDialogComponent, {
            width: '400px',
            data: { dialogTitle: title, dialogMessage: message, dialogType: type },
            disableClose: true,
            autoFocus: true
        });

        this.alertDialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });

        return this.alertDialogRef.afterClosed();

    }
}