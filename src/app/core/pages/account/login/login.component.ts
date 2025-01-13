import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { getAuth, RecaptchaVerifier } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { removeSpaces } from 'src/app/shared/directives/input-trim.directive';
import { User } from 'src/app/shared/models/user.interface';
import { AlertType } from 'src/app/shared/services/alert.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogType } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import { WindowService } from 'src/app/shared/services/window.service';
// import {
//   getAuth,RecaptchaVerifier,signInWithPhoneNumber,
//   } from "firebase/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  public isLoading = false;
  public loginFormToggle = false;
  windowRef: any;
  user: User = {};
  public mobileNumberFormControl: FormControl;
  public otpFormControl: FormControl;
  public hidePassword = true;
  private unSubscriptioNotifier = new Subject();
  public otpCountDown: number;
  public startCountDown = false;
  public countDownText = '';
  private auth = getAuth();
  private recaptchaVerifier: RecaptchaVerifier;

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
    this.mobileNumberFormControl = new FormControl('', [
      Validators.required,
      removeSpaces,
    ]);
    this.otpFormControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(6),
      Validators.minLength(6),
      removeSpaces,
    ]);
  }

  ngOnInit(): void {
    //this.localAuth.defaultLogin()

    if (this.localAuth.getUser().id != undefined) {
      this.goToDashboard();
    }
    //this.appMaterialComponent.showProgressDialog('loading...')
  }

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
    //console.log('num :' + num)
    this.mobileNumberFormControl.setValue('');
    //appVerifier.verify();
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
    if (this.otpFormControl.value) {
      let verificationCode = this.otpFormControl.value.trim();
      this.otpFormControl.setValue('');
      this.windowRef.confirmationResult
        .confirm(verificationCode)
        .then((result) => {
          if (result) {
            this.backend
              .getUserAccount(this.user.account.id)
              .pipe(takeUntil(this.unSubscriptioNotifier))
              .subscribe({
                next: (result) => {
                  //console.log(JSON.stringify(result));
                  this.user.account = result;
                  this.localAuth.setUser(this.user);
                  this.appMaterialComponent.showAlertToaster(
                    AlertType.success,
                    `Welcome back ${this.user.fullname}`,
                    5
                  );
                  switch (this.user.role) {
                    case 'SYS_ADMIN':
                    case 'ADMIN':
                      this.router.navigate(['/dashboard/admin'], {
                        queryParams: {},
                        skipLocationChange: false,
                      });
                      break;
                    case 'MANAGER':
                      this.router.navigate(['/dashboard/manager'], {
                        queryParams: {},
                        skipLocationChange: false,
                      });
                      break;
                    case 'ACCOUNTANT':
                      this.router.navigate(['/dashboard/manager'], {
                        queryParams: {},
                        skipLocationChange: false,
                      });
                      break;

                    case 'ATTENDANT':
                      this.router.navigate(['/dashboard/attendant'], {
                        queryParams: {},
                        skipLocationChange: false,
                      });
                      break;

                    default:
                      this.router.navigate(['/login']);
                  }
                },
              });
          } else {
            this.appMaterialComponent.showAlertDialog(
              DialogType.error,
              'Login',
              'Incorrect PIN entered. Please try again.'
            );
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
    if (this.mobileNumberFormControl.value) {
      let num = this.mobileNumberFormControl.value.trim();
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
              this.appMaterialComponent
                .openDialog(ConfirmDialogComponent, {
                  width: '500px',
                  title: 'Caution',
                  message:
                    'Your mobile number is not registered with us. Kindly Sign up instead.',
                })
                .pipe(takeUntil(this.unSubscriptioNotifier))
                .subscribe();
            } else {
              this.user = result.map((item) => {
                return {
                  id: item.payload.doc.id,
                  ...item.payload.doc.data(),
                } as User;
              })[0];
              //console.log('this.user : ' + JSON.stringify(this.user));
              this.sendLoginCode(num);
            }
          },
        });
    }
  }

  public goToDashboard() {
    const userRole = this.localAuth.getUser().role;

    switch (userRole) {
      case 'SYS_ADMIN':
      case 'ADMIN':
        this.router.navigate(['/dashboard/admin'], {
          queryParams: {},
          skipLocationChange: false,
        });
        break;
      case 'MANAGER':
        this.router.navigate(['/dashboard/manager'], {
          queryParams: {},
          skipLocationChange: false,
        });
        break;
      case 'ACCOUNTANT':
        this.router.navigate(['/dashboard/manager'], {
          queryParams: {},
          skipLocationChange: false,
        });
        break;

      case 'ATTENDANT':
        this.router.navigate(['/dashboard/attendant'], {
          queryParams: {},
          skipLocationChange: false,
        });
        break;

      default:
        this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
    this.windowRef.recaptchaVerifier.clear();
  }
}
