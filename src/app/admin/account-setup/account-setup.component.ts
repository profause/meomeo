import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-account-setup',
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.scss'],
})
export class AccountSetupComponent implements OnInit, OnDestroy {
  public accountFormGroup: FormGroup;
  private unSubscriptioNotifier = new Subject();
  public loginFormToggle = false;
  public isLoading = false;
  user: User = {};
  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private firebaseAuth: AngularFireAuth,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService
  ) {
    this.accountFormGroup = new FormGroup({
      id: new FormControl('', Validators.nullValidator),
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      dateCreated: new FormControl(
        new Date().getTime().toString(),
        Validators.nullValidator
      ),
      fullname: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.nullValidator),
      role: new FormControl('ADMIN', Validators.nullValidator),
      status: new FormControl('ACTIVE', Validators.nullValidator),
      isTrialPeriodDue: new FormControl(false, Validators.nullValidator),
      logo: new FormControl('', Validators.nullValidator),
    });

    this.user = this.localAuth.getUser();
  }

  ngOnInit(): void {
    this.getAccount(this.user.account.id);
  }

  public getAccount(id: string) {
    this.backend
      .getUserAccount(id)
      .pipe(takeUntil(this.unSubscriptioNotifier))
      .subscribe((account) => {
        this.accountFormGroup.patchValue({
          id: account.id,
          name: account.name,
          address: account.address,
          dateCreated: account.dateCreated,
          fullname: this.user.fullname,
          mobileNumber: this.user.mobileNumber,
          role: this.user.role,
          status: account.status,
          isTrialPeriodDue: account.isTrialPeriodDue,
          logo: account.logo,
        });
      });
  }

  public save(): void {}

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
