import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { getAuth, RecaptchaVerifier } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, take } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Account } from 'src/app/shared/models/account.interface';
import { User } from 'src/app/shared/models/user.interface';
import { AlertType } from 'src/app/shared/services/alert.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import { WindowService } from 'src/app/shared/services/window.service';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnDestroy{
  public registerFormGroup: FormGroup;
  private unSubscriptioNotifier = new Subject();
  public loginFormToggle = false;
  public otpCountDown: number;
  public startCountDown = false;
  public countDownText = '';
  windowRef: any;
  user: User = {};
  public isLoading = false;
  private auth = getAuth();
  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private firebaseAuth: AngularFireAuth,
    private win: WindowService,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService
  ) {
    this.registerFormGroup = new FormGroup({
      id: new FormControl(Utils.generateUUID(), Validators.nullValidator),
      name: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      dateCreated: new FormControl(
        new Date().getTime().toString(),
        Validators.nullValidator
      ),
      fullname: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.nullValidator),
      role: new FormControl('ADMIN', Validators.nullValidator),
      otp: new FormControl('', Validators.nullValidator),
      status: new FormControl('ACTIVE', Validators.nullValidator),
    });
  }

  ngOnInit(): void {}

  startOtpCountDown(seconds: number) {
    this.startCountDown = true;
    var timeinterval = setInterval(() => {
      seconds -= 1;
      this.otpCountDown = seconds;
      this.countDownText = `Resend in ${seconds}`;
      //console.log("seconds : "+seconds)
      if (seconds <= 0) {
        clearInterval(timeinterval);
        this.countDownText = `Resend now`;
      }
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.windowRef = this.win.windowRef;
      this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
        this.auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {},
        }
      );
      this.windowRef.recaptchaVerifier.render();
  }

  public sendLoginCode(num: string) {
    this.isLoading = true;
    const appVerifier = this.windowRef.recaptchaVerifier;

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

    this.firebaseAuth
      .signInWithPhoneNumber(num, appVerifier)
      .then((result) => {
        this.isLoading = false;
        this.loginFormToggle = true;
        this.windowRef.confirmationResult = result;
        this.startOtpCountDown(60);
      })
      .catch((error) => {
        this.isLoading = false;
        this.loginFormToggle = false;
        console.log(error);
      });
  }

  public verifyLoginCode() {
    this.isLoading = true;
    if (this.registerFormGroup.controls['otp'].value) {
      let verificationCode = this.registerFormGroup.controls['otp'].value;
      this.registerFormGroup.patchValue({
        otp: '',
      });
      this.windowRef.confirmationResult
        .confirm(verificationCode)
        .then((result) => {
          if (result) {
            this.createAccount();
          }
        })
        .catch((error: any) => {
          this.isLoading = false;
          console.log(error, 'Incorrect code entered');
        });
    }
  }

  public verify() {
    this.isLoading = true;
    if (this.registerFormGroup.controls['mobileNumber'].value) {
      let num = this.registerFormGroup.controls['mobileNumber'].value.trim();

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
      //console.log('num :' + num)
      this.user['mobileNumber'] = num;

      this.backend
        .getUserByMobileNumber(num)
        .pipe(takeUntil(this.unSubscriptioNotifier))
        .subscribe({
          next: (result) => {
            this.isLoading = false;
            if (result.length === 0) {
              this.sendLoginCode(num);
            } else {
              this.appMaterialComponent
                .openDialog(ConfirmDialogComponent, {
                  width: '500px',
                  title: 'Caution',
                  message:
                    'An account is already registered with this mobile number. Kindly enter a different mobile.',
                })
                .pipe(takeUntil(this.unSubscriptioNotifier))
                .subscribe();

              // this.user = result.map((item) => {
              //   this.user.role = 'ADMIN'
              //   return {
              //     id: item.payload.doc.id,
              //     ...item.payload.doc.data(),
              //   } as User;
              // })[0];
            }
          },
        });
    }
  }

  public createAccount() {
    this.isLoading = true;
    let formData = this.registerFormGroup.value;
    delete formData['otp'];

    let account: Account = {
      id: formData['id'],
      name: formData['name'],
      location: formData['location'],
      dateCreated: formData['dateCreated'],
      status: formData['status'],
      createdBy: formData['id'],
    };

    //console.log('account ', account);

    this.user.id = formData['id'];
    this.user.role = formData['role'];
    this.user.fullname = formData['fullname'].trim();
    //this.user.mobileNumber = formData['mobileNumber'].trim();
    this.user.dateCreated = formData['dateCreated'];
    this.user.account = {
      id: formData['id'],
      name: formData['name'],
    };

   //this.user.account = formData['id'];

    //console.log('user ', this.user);
    this.localAuth.setUser(this.user);

    this.backend
      .createAccount(account, this.user)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          setTimeout(() => {
            this.isLoading = false;
            this.appMaterialComponent.showAlertToaster(
              AlertType.success,
              `Welcome ${this.user.fullname}`,
              5
            );
            this.router.navigate(['/dashboard/admin'], {
              queryParams: { tetele: 'welcome_new_user' },
              skipLocationChange: false,
            });
          }, 500);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
    this.windowRef.recaptchaVerifier.clear();
  }
}
