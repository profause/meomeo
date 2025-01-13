import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Sale } from 'src/app/shared/models/sale.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagerComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public authUser: User;
  private unSubscriptioNotifier = new Subject();

  public numberOfSales$: Observable<number> = new Observable<number>();
  public numberOfSalesBehaviour: BehaviorSubject<number>;
  public salesRevenueToday$: Observable<number> = new Observable<number>();
  public salesRevenueTodayBehaviour: BehaviorSubject<number>;

  public numberOfCustomers$: Observable<number> = new Observable<number>();
  public numberOfCustomersBehaviour: BehaviorSubject<number>;

  public numberOfAttendants$: Observable<number> = new Observable<number>();
  public numberOfAttendantsBehaviour: BehaviorSubject<number>;

  public salesList = new Array<Sale>();
  public salesList$: Observable<Sale[]> = new Observable<Sale[]>();
  public salesListBehaviour: BehaviorSubject<Sale[]>;

  public attendantList = new Array<User>();
  public attendantList$: Observable<User[]> = new Observable<User[]>();
  public attendantListBehaviour: BehaviorSubject<User[]>;

  public customerList = new Array<any>();
  public customerList$: Observable<User[]> = new Observable<any[]>();
  public customerListBehaviour: BehaviorSubject<any[]>;

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService
  ) {
    this.authUser = localAuth.getUser();
    this.numberOfSalesBehaviour = new BehaviorSubject(0);
    this.numberOfSales$ = this.numberOfSalesBehaviour.asObservable();

    this.numberOfCustomersBehaviour = new BehaviorSubject(0);
    this.numberOfCustomers$ = this.numberOfCustomersBehaviour.asObservable();

    this.numberOfAttendantsBehaviour = new BehaviorSubject(0);
    this.numberOfAttendants$ = this.numberOfAttendantsBehaviour.asObservable();

    this.salesListBehaviour = new BehaviorSubject([]);
    this.salesList$ = this.salesListBehaviour.asObservable();

    this.attendantListBehaviour = new BehaviorSubject([]);
    this.attendantList$ = this.attendantListBehaviour.asObservable();

    this.customerListBehaviour = new BehaviorSubject([]);
    this.customerList$ = this.customerListBehaviour.asObservable();

  }

  ngOnInit(): void {
    this.getSalesCount();
    this.getCustomerCount();
    //this.getCustomers();
    this.getAttendatCount();
    this.getSales();
    this.getAttendants();
  }

  public getSales() {
    this.isLoading = true;
    this.backend
      .getSales({ limit: 10 })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          let sales = result.map((item) => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data(),
            } as Sale;
          });

          this.salesList = sales;
          this.salesListBehaviour.next(sales);

          const unique = [...new Set(sales.map((item) => item.customerName))];
          this.customerListBehaviour.next(unique);
        },
      });
  }

  public getAttendants() {
    this.isLoading = true;
    this.backend
      .getAttendants()
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

          this.attendantList = users;
          this.attendantListBehaviour.next(users);
        },
      });
  }

  public getCustomers() {
    this.isLoading = true;
    this.backend
      .getCustomers()
      .pipe(take(1))
      .subscribe({
        next: (customers) => {
          this.isLoading = false;
          this.customerList = customers;
          this.customerListBehaviour.next(customers);
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

  public getSalesCount() {
    this.backend.getSalesCount().subscribe({
      next: (result) => {
        this.numberOfSalesBehaviour.next(result);
      },
    });
  }

  public getAttendatCount() {
    this.backend.getAttendantCount().subscribe({
      next: (result) => {
        this.numberOfAttendantsBehaviour.next(result);
      },
    });
  }


  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
