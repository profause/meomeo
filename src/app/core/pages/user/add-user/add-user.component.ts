import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { User } from 'src/app/shared/models/user.interface';
import { AlertType } from 'src/app/shared/services/alert.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddUserComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public addUserFormGroup: FormGroup;
  private unSubscriptioNotifier = new Subject();
  public authUser: User;

  constructor(
    public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService
  ) {
    this.authUser = localAuth.getUser();
    this.addUserFormGroup = new FormGroup({
      id: new FormControl(Utils.generateUUID(), Validators.nullValidator),
      fullname: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.nullValidator),
      role: new FormControl('', Validators.nullValidator),
    });
  }

  ngOnInit(): void {
  }

  public submit() {
    this.isLoading = true;
    let formData = this.addUserFormGroup.value;
    console.log(JSON.stringify(formData))
    let num = formData['mobileNumber'].trim();
    if (num.startsWith('0')) {
      num = num.slice(1, num.length);
      num = '+233' + num;
    }

    if (num.startsWith('233')) {
      num = num.slice(3, num.length);
      num = '+233' + num;
    }

    if (num.startsWith('+')) {
      num = num.slice(4, num.length);
      num = '+233' + num;
    }
    formData['mobileNumber'] = num;
    if ("" != num) {
      //check if user mobile number exist
      this.backend
        .getUserByMobileNumber(num)
        .pipe(takeUntil(this.unSubscriptioNotifier))
        .subscribe({
          next: (result) => {
            this.isLoading = false;
            if (result.length > 0) {
              this.appMaterialComponent
                .openDialog(ConfirmDialogComponent, {
                  width: '400px',
                  title: 'Caution',
                  message:
                    'Mobile number is registered with a different account. Kindly check again.',
                })
                .pipe(takeUntil(this.unSubscriptioNotifier))
                .subscribe();
            } else {
              formData['createdBy'] = this.authUser.id;
              formData['dateCreated'] = new Date().getTime().toString();
              formData['account'] = this.authUser.account;

              this.backend
                .addUser(formData)
                .pipe(take(1))
                .subscribe({
                  next: (response) => {
                    this.isLoading = false;
                    this.appMaterialComponent.showAlertToaster(
                      AlertType.success,
                      `User created successfully.`,
                      5
                    );
                    this.router.navigate(['/users'], {
                      skipLocationChange: false,
                    });
                  },
                  error: (error) => {
                    console.log(error);
                  },
                });
            }
          },
        });
    } else {
      console.log('herer la')
      formData['createdBy'] = this.authUser.id;
      formData['dateCreated'] = new Date().getTime().toString();
      formData['account'] = this.authUser.account;

      this.backend
        .addUser(formData)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.appMaterialComponent.showAlertToaster(
              AlertType.success,
              `User created successfully.`,
              5
            );
            this.router.navigate(['/users'], {
              skipLocationChange: false,
            });
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
