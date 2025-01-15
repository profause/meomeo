import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditAccountComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public editAccountFormGroup: FormGroup;
  private unSubscriptioNotifier = new Subject();
  public authUser: User;

  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService
  ) {
    this.authUser = localAuth.getUser();

    this.editAccountFormGroup = new FormGroup({
      id: new FormControl('', Validators.nullValidator),
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      dateCreated: new FormControl(
        new Date().getTime().toString(),
        Validators.nullValidator
      ),
      status: new FormControl('ACTIVE', Validators.nullValidator),
    });
  }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params) => {
      let id = params.get('id') || '0';
      if (id == '0') {
        this.router.navigate(['/accounts'], {
          skipLocationChange: false,
        });
        return;
      }
      this.getUserAccount(id);
    });
  }

  public getUserAccount(id: string) {
    this.isLoading = true;
    this.backend
      .getUserAccount(id)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          this.editAccountFormGroup.patchValue({
            id: result.id,
            name: result.name,
            address: result.address,
            createdBy: result.createdBy,
            dateCreated: result.dateCreated,
            status: result.status,
          });
        },
      });
  }

  public submit() {
    this.isLoading = true;
    let account = this.editAccountFormGroup.value;
    this.backend
      .updateAccount(account,this.authUser)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.appMaterialComponent.showAlertToaster(
            AlertType.success,
            'Location added successfully.',
            5
          );
          this.router.navigate(['/accounts'], {
            //queryParams: { tetele: 'welcome_new_user' },
            skipLocationChange: false,
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
