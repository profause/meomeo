import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { User } from 'src/app/shared/models/user.interface';
import { AlertType } from 'src/app/shared/services/alert.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditUserComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public editUserFormGroup: FormGroup;
  private unSubscriptioNotifier = new Subject();
  public authUser: User;
  public user: User;
  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService
  ) {
    this.authUser = localAuth.getUser();
    this.editUserFormGroup = new FormGroup({
      id: new FormControl('', Validators.nullValidator),
      fullname: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.nullValidator),
      role: new FormControl('', Validators.nullValidator),
    });
  }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params) => {
      let id = params.get('id') || '0';
      if (id == '0') {
        this.router.navigate(['/users'], {
          skipLocationChange: false,
        });
        return;
      }
      this.getUser(id);
    });
  }

  public submit() {
    this.isLoading = true;
    let formData = this.editUserFormGroup.value;
    let num = formData['mobileNumber'];
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
    //formData['createdBy'] = this.authUser.id;
    //formData['dateCreated'] = new Date().getTime().toString();

    this.backend
      .updateUser(formData)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.appMaterialComponent.showAlertToaster(
            AlertType.success,
            `User updated successfully.`,
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

  public getUser(id) {
    this.isLoading = true;
    this.backend
      .getUser(id)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          //console.log('result : ',JSON.stringify(result))
          this.isLoading = false;
          this.editUserFormGroup.patchValue({
            id: result.id,
            fullname: result.fullname,
            mobileNumber: result.mobileNumber,
            role: result.role,
            account: result.account,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
