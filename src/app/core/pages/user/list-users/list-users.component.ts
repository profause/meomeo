import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, BehaviorSubject, of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap, take, takeUntil, switchMap } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { User } from 'src/app/shared/models/user.interface';
import { AlertType } from 'src/app/shared/services/alert.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogButton } from 'src/app/shared/services/dialog.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ListUsersComponent implements OnInit,OnDestroy {
  public isLoading = false;
  public authUser: User;
  private unSubscriptioNotifier = new Subject();
  public searchInput: FormControl;

  public userList = new Array<User>();
  public userList$: Observable<User[]> = new Observable<User[]>();
  public userListBehaviour: BehaviorSubject<User[]>;
  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private dataSource: DataService
  ) {
    this.authUser = localAuth.getUser();
    this.userListBehaviour = new BehaviorSubject([]);
    this.userList$ = this.userListBehaviour.asObservable();
    this.searchInput = new FormControl('');
  }
  ngOnInit(): void {
    this.getUsers();

    this.searchInput.valueChanges
      .pipe(
        debounceTime(150),
        map((emittedValue) => emittedValue.trim()),
        distinctUntilChanged(),
        tap(),
        map((name) => (name ? this._filter(name) : this.userList.slice()))
      )
      .subscribe((value) => {
        this.userListBehaviour.next(value);
      });
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.userList.filter(
      (user) => user.fullname.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public getUsers() {
    this.isLoading = true;
    this.backend
      .getUsers()
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          let users = result.map((item) => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data(),
            } as User;
          });

          this.userList = users;
          this.userListBehaviour.next(users);
        },
      });
  }

  public onDeleteUser(user: User) {
    this.appMaterialComponent
      .openDialog(ConfirmDialogComponent, {
        title: 'Confirm',
        message: `Are you sure you want to delete this user?`,
      })
      .pipe(
        takeUntil(this.unSubscriptioNotifier),
        switchMap((result) => {
          if (result['button'] == DialogButton.ok) {
            this.appMaterialComponent.showProgressDialog(
              'Deleting user. Please wait a while.'
            ); 
            return this.backend.deleteUser(user.id);
          }else{
            return of(null)
          }
        })
      )
      .subscribe({
        next: (result) => {
          this.appMaterialComponent.hideProgressDialog();
          if(result){
          this.appMaterialComponent.showAlertToaster(AlertType.success, `User has been deleted.`, 5)
          this.getUsers();
        }
        },
        error: (error) => {
          this.appMaterialComponent.hideProgressDialog()
          console.log(error)
        },
      });
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }

}
