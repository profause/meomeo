import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { Sale } from 'src/app/shared/models/sale.interface';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-attendant',
  templateUrl: './attendant.component.html',
  styleUrls: ['./attendant.component.scss'],
})
export class AttendantComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public authUser: User;
  private unSubscriptioNotifier = new Subject();

  public salesList = new Array<Sale>();
  public salesList$: Observable<Sale[]> = new Observable<Sale[]>();
  public salesListBehaviour: BehaviorSubject<Sale[]>;
  public filterFormControl: FormControl;
  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService
  ) {
    this.authUser = localAuth.getUser();
    this.salesListBehaviour = new BehaviorSubject([]);
    this.salesList$ = this.salesListBehaviour.asObservable();

    this.filterFormControl = new FormControl('TODAY');
  }

  ngOnInit(): void {
    this.getSales();
    console.log(this.authUser.id)
    this.filterFormControl.valueChanges
      .pipe(
        takeUntil(this.unSubscriptioNotifier),
        debounceTime(300),
        distinctUntilChanged(),
        tap(),
        switchMap((filter)=>{
          this.isLoading = true;
          return this.backend.filterAttendantSales(filter,this.authUser.id);
        })
      )
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
        },
      });
  }

  public getSales() {
    this.isLoading = true;
    this.backend
      .filterAttendantSales('TODAY',this.authUser.id)
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
        },
      });
  }

  public timestampToDate(timestamp) {
    return timestamp.toDate().toDateString();
  }
  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next('');
    this.unSubscriptioNotifier.complete();
  }
}
