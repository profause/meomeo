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
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddAccountComponent implements OnInit, OnDestroy {
  public addAccountFormGroup: FormGroup;
  public isLoading = false;
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

    this.addAccountFormGroup = new FormGroup({
      id: new FormControl(Utils.generateUUID(), Validators.nullValidator),
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      dateCreated: new FormControl(
        new Date().getTime().toString(),
        Validators.nullValidator
      ),
      status: new FormControl('ACTIVE', Validators.nullValidator),
    });
  }

  ngOnInit(): void {}

  public submit() {
    this.isLoading = true;
    let account = this.addAccountFormGroup.value;
    account['createdBy'] = this.authUser.id;
    if (undefined != this.authUser.accounts) {
      this.authUser.accounts.push(account['id']);
    } else {
      this.authUser.accounts = [account['id']];
    }
    this.backend
      .addAccount(account, this.authUser)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          let accountIds = new Set(this.authUser.accounts);
          this.authUser.accounts = [...accountIds];

          this.localAuth.setUser(this.authUser);
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
