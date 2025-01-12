import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest, forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { OrderItem } from '../../models/order-item';
import { PaymentInfo } from '../../models/payment-info';
import { BackendService } from '../../services/backend.service';
import { DataService } from '../../services/data.service';
import { DialogButton, DialogOptions, DialogService } from '../../services/dialog.service';
import { LocalAuthService } from '../../services/local-auth.service';

@Component({
  selector: 'app-order-item-detail-dialog',
  templateUrl: './order-item-detail-dialog.component.html',
  styleUrls: ['./order-item-detail-dialog.component.scss']
})
export class OrderItemDetailDialogComponent implements OnInit, OnDestroy {

  public isLoading = false;
  public orderItem: OrderItem = {}
  public paymentInfo: PaymentInfo = {}
  private orderId: string
  private unSubscriptioNotifier = new Subject();

  constructor(private router: Router,
    private backend: BackendService,
    private localAuthService: LocalAuthService,
    private appMaterialComponent: AppMaterialDesignModule,
    private _route: ActivatedRoute,
    private dataSource: DataService,
    public dialogRef: MatDialogRef<OrderItemDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogOptions: DialogOptions,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.dataSource.currentdata.pipe(
      switchMap((data) => {
        this.orderId = data
        console.log(this.orderId)
        return combineLatest(
          [
            this.backend.getOrderItem(this.orderId),
            this.backend.getPaymentInfo(this.orderId)
          ]
        ).pipe(takeUntil(this.unSubscriptioNotifier))
      })).subscribe({
        next: (orderAndPayment) => {
          this.isLoading = false
          console.log('order : ' + JSON.stringify(orderAndPayment))
          if (null == orderAndPayment[0]) {
            //this.router.navigate(['home'], { queryParams: {tab:1}, skipLocationChange: false });
          } else {
            this.orderItem = orderAndPayment[0];
            this.paymentInfo = orderAndPayment[1];
          }

        }, error: (error) => {
          this.isLoading = false
        }
      })
  }

  public getOrderItem() {
    this.backend.getOrderItem(this.orderId).subscribe({
      next: (order) => {
        console.log('order : ' + JSON.stringify(order))
      }
    })
  }

  public ok(): void {
    this.isLoading = true;
    this.dialogService.sendMessage({ text: 'ok button clicked', button: DialogButton.ok });
    this.dialogRef.close();
  }

  public process(): void {
    this.isLoading = true;
    this.dialogService.sendMessage({ text: 'process', button: DialogButton.ok });
    this.dialogRef.close();
  }

  public cancel(): void {
    this.isLoading = false;
    //this.dialogService.sendMessage({ text: 'cancel button clicked', button: DialogButton.cancel });
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unSubscriptioNotifier.next()
    this.unSubscriptioNotifier.complete()
  }

}
