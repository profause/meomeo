import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Food } from '../../models/food.interface';
import { BackendService } from '../../services/backend.service';
import { DialogButton, DialogOptions, DialogService } from '../../services/dialog.service';
import { AssignDispatchDialogComponent } from '../assign-dispatch-dialog/assign-dispatch-dialog.component';

@Component({
  selector: 'app-food-menu-dialog',
  templateUrl: './food-menu-dialog.component.html',
  styleUrls: ['./food-menu-dialog.component.scss']
})
export class FoodMenuDialogComponent implements OnInit, OnDestroy {

  public isLoading = false;
  private unSubscriptioNotifier = new Subject();
  public foodMenuFormGroup: FormGroup;
  public food: Food;
  constructor(public dialogRef: MatDialogRef<AssignDispatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private backend: BackendService,
    private dialogService: DialogService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,) {

    this.matIconRegistry.addSvgIcon(
      'file_upload',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/file_upload.svg')
    );

    this.food = dialogOptions.data || {};
    this.foodMenuFormGroup = new FormGroup({
      id: new FormControl(this.food.id, [Validators.nullValidator]),
      name: new FormControl(this.food.name, [Validators.required]),
      description: new FormControl(this.food.description, [Validators.required]),
      cost: new FormControl(this.food.cost, [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  public cancel(): void {
    this.isLoading = false;
    this.dialogService.sendMessage({ text: 'cancel button clicked', button: DialogButton.cancel });
    this.dialogRef.close();
  }

  public done(){
    this.dialogService.sendMessage({ text: 'ok button clicked', button: DialogButton.ok });
    this.dialogRef.close();
  }

  public save() {
    this.isLoading = true;
    let food = this.foodMenuFormGroup.value;
    if (food.id) {
      //update
      this.backend.updateFoodMenu(food)
        .pipe(takeUntil(this.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            this.isLoading = false
            this.done()
          }, error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            this.isLoading = false
          }, complete: () => {
            this.isLoading = false;
            console.log('on complete updateFoodMenu');
          }
        })
    } else {
      //add
      this.backend.addFoodMenu(food)
        .pipe(takeUntil(this.unSubscriptioNotifier))
        .subscribe({
          next: (response) => {
            this.done()
            this.isLoading = false
          }, error: (err: any) => {
            console.log('An error occurred:', err.error.message);
            this.isLoading = false
          }, complete: () => {
            this.isLoading = false;
            console.log('on complete addFoodMenu');
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('')
    this.unSubscriptioNotifier.complete()
  }

}
