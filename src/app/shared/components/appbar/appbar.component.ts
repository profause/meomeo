import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Account } from '../../models/account.interface';
import { User } from '../../models/user.interface';
import { AlertType } from '../../services/alert.service';
import { BackendService } from '../../services/backend.service';
import { DataService } from '../../services/data.service';
import { DialogButton } from '../../services/dialog.service';
import { LocalAuthService } from '../../services/local-auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.scss'],
})
export class AppbarComponent implements OnInit, AfterViewInit, OnDestroy {
  public authUser: User = null;
  public isLoading = false;
  @Input('title') title: string;

  private unSubscriptioNotifier = new Subject();

  public locationList = new Array<any>();
  public locationList$: Observable<Account[]> = new Observable<Account[]>();
  public locationListBehaviour: BehaviorSubject<Account[]>;

  constructor(
    public router: Router,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService
  ) {
    this.authUser = localAuth.getUser();
    this.locationListBehaviour = new BehaviorSubject([]);
    this.locationList$ = this.locationListBehaviour.asObservable();
  }
  ngAfterViewInit(): void {
    //this.authUser = this.localAuth.getAuthUser();
  }

  ngOnInit(): void {
    //this.authUser = this.localAuth.getAuthUser();
  }

  public signOut() {
    this.appMaterialComponent.showProgressDialog('Signing out...');
    setTimeout(() => {
      this.localAuth.signOut();
      this.router.navigate(['login'], {
        queryParams: {},
        skipLocationChange: false,
      });
      this.appMaterialComponent.hideProgressDialog();
    }, 800);
  }

  public goToDashboard(role = '') {
    let userRole = this.localAuth.getUser().role;
    if (role.length > 1) userRole = role;
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

  public getUserAccounts() {
    this.isLoading = true;
    this.backend
      .getUserAccounts(this.authUser.id)
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          let accounts = result.map((item) => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data(),
            } as Account;
          });

          const index = accounts.findIndex(
            (obj) => obj.id == this.authUser.account.id
          );
          accounts.splice(index, 1);

          this.locationList = accounts;
          this.locationListBehaviour.next(accounts);
        },
      });
  }

  public switchAccount(account: Account) {
    this.appMaterialComponent
      .openDialog(ConfirmDialogComponent, {
        title: 'Confirm',
        message: `Are you sure you want to switch to this location?`,
      })
      .pipe(
        takeUntil(this.unSubscriptioNotifier),
        switchMap((result) => {
          if (result['button'] == DialogButton.ok) {
            this.appMaterialComponent.showProgressDialog(
              'Switching location. Please wait a while.'
            );
            let s = this.authUser.account?.subscription || {};
            account.subscription = s;
            this.authUser.account = account;
            this.localAuth.setUser(this.authUser);
            return of(true);
          } else {
            return of(false);
          }
        })
      )
      .subscribe((result) => {
        if (result) {
          this.appMaterialComponent.hideProgressDialog();
          this.appMaterialComponent.showAlertToaster(
            AlertType.success,
            `Location switched successfully.`,
            5
          );
          this.goToDashboard();
        }
      });
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
