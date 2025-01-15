import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Account } from 'src/app/shared/models/account.interface';
import { User } from 'src/app/shared/models/user.interface';
import { AlertType } from 'src/app/shared/services/alert.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DialogButton } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ListAccountComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public authUser: User;
  private unSubscriptioNotifier = new Subject();

  public locationList = new Array<any>();
  public locationList$: Observable<Account[]> = new Observable<Account[]>();
  public locationListBehaviour: BehaviorSubject<Account[]>;
  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService
  ) {
    this.authUser = localAuth.getUser();
    this.locationListBehaviour = new BehaviorSubject([]);
    this.locationList$ = this.locationListBehaviour.asObservable();
  }

  ngOnInit(): void {
    this.getUserAccounts();
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
          this.locationList = accounts;
          this.locationListBehaviour.next(accounts);
        },
      });
  }

  public onDeleteAccount(account:Account){
    this.appMaterialComponent
      .openDialog(ConfirmDialogComponent, {
        title: 'Confirm',
        message: `Are you sure you want to delete this location?`,
      })
      .pipe(
        takeUntil(this.unSubscriptioNotifier),
        switchMap((result) => {
          if (result['button'] == DialogButton.ok) {
            this.appMaterialComponent.showProgressDialog(
              'Deleting location. Please wait a while.'
            );
            return this.backend.deleteUserAccount(account.id);
          }
          return of('')
        })
      )
      .subscribe({
        next: (result) => {
          this.appMaterialComponent.hideProgressDialog();
          this.appMaterialComponent.showAlertToaster(
            AlertType.success,
            `Location has been deleted.`,
            5
          );
          this.getUserAccounts();
        },
        error: (error) => {
          this.appMaterialComponent.hideProgressDialog();
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
