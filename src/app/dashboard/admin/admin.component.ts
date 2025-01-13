import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BdcWalkService } from 'bdc-walkthrough';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy, AfterViewInit {
  public isLoading = false;
  public authUser: User;
  private unSubscriptioNotifier = new Subject();

  public numberOfUsers$: Observable<number> = new Observable<number>();
  public numberOfUsersBehaviour: BehaviorSubject<number>;

  public numberOfCustomers$: Observable<number> = new Observable<number>();
  public numberOfCustomersBehaviour: BehaviorSubject<number>;

  public userList = new Array<User>();
  public userList$: Observable<User[]> = new Observable<User[]>();
  public userListBehaviour: BehaviorSubject<User[]>;

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
    private bdcWalkService: BdcWalkService
  ) {
    this.authUser = localAuth.getUser();
    this.numberOfUsersBehaviour = new BehaviorSubject(0);
    this.numberOfUsers$ = this.numberOfUsersBehaviour.asObservable();

    this.numberOfCustomersBehaviour = new BehaviorSubject(0);
    this.numberOfCustomers$ = this.numberOfCustomersBehaviour.asObservable();

    this.userListBehaviour = new BehaviorSubject([]);
    this.userList$ = this.userListBehaviour.asObservable();
  }

  ngOnInit(): void {
    if (undefined == this.authUser.account.subscription) {
      // this.bdcWalkService.reset('bdc');
    }
  }

  ngAfterViewInit(): void {
    this.getUserCount();
    this.getCustomerCount();
    this.getUsers();
  }

  public getUserCount() {
    this.backend.getUserCount().subscribe({
      next: (result) => {
        this.numberOfUsersBehaviour.next(result);
      },
    });
  }

  public getCustomerCount() {
    this.backend.getCustomerCount().subscribe({
      next: (result) => {
        this.numberOfCustomersBehaviour.next(result);
      },
    });
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

  public timestampToDate(timestamp, format: string) {
    return moment(timestamp).format(format);
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
