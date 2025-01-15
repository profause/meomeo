import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { OrderItem } from '../models/order-item';
import { PaymentInfo } from '../models/payment-info';
import { Setting } from '../models/setting';
import { User } from '../models/user.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LocalAuthService } from './local-auth.service';
import { Sale } from '../models/sale.interface';
import * as moment from 'moment';
import { Timestamp } from '@firebase/firestore';
import { Section } from '../models/section.interface';
@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public authUser: User;
  constructor(
    private httpClient: HttpClient,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private localAuth: LocalAuthService
  ) {
    this.authUser = this.localAuth.getUser();
  }

  getDeliveryLocations(): Observable<any> {
    return this.firestore
      .collection(`locations`, (ref) => ref.limit(15))
      .snapshotChanges()
      .pipe(take(1));
  }

  getFoodList(): Observable<any> {
    return this.firestore
      .collection(`food_store`, (ref) => ref.limit(15))
      .snapshotChanges()
      .pipe(take(1));
  }

  getFoodItemImage(filePath: string) {
    const gsReference = this.storage.refFromURL(filePath);
    //const storageRef = this.storage.ref('foods/');
    return gsReference.getDownloadURL();
  }

  getOrderItemList(userId: string): Observable<any> {
    return this.firestore
      .collection(
        `orders`,
        (ref) => ref.limit(15).where('user_id', '==', userId) //.where(
        //   'softDelete', '==', false
        // )
      )
      .snapshotChanges();
  }

  getOrderItem(orderId: string): Observable<any> {
    return this.firestore.doc(`/orders/${orderId}`).valueChanges();
  }

  createUser(user: User): Observable<any> {
    return from(this.firestore.doc(`/users/${user.id}`).set({ ...user }));
  }

  updateUser(user: User): Observable<any> {
    return from(
      this.firestore.doc(`/users/${user.id}`).update({ ...user })
    ).pipe(take(1));
  }

  getUser(user_id: string): Observable<any> {
    return this.firestore.doc(`/users/${user_id}`).valueChanges().pipe(take(1));
  }

  getUserByMobileNumber(mobileNumber: string): Observable<any> {
    return this.firestore
      .collection(`users`, (ref) =>
        ref.limit(15).where('mobileNumber', '==', mobileNumber)
      )
      .snapshotChanges()
      .pipe(take(1));
  }

  setUserAppSettings(setting: Setting): Promise<any> {
    //console.log('setUserAppSettings')
    return this.firestore
      .doc(`/settings/${setting.user_id}`)
      .set({ ...setting });
  }

  getUserAppSettings(user_id: string): Observable<any> {
    //console.log('hhhrrerer')
    return this.firestore.doc(`/settings/${user_id}`).valueChanges();
  }

  createOrder(orderItem: OrderItem): Observable<any> {
    return from(
      this.firestore.doc(`/orders/${orderItem.id}`).set({ ...orderItem })
    );
  }

  updateOrder(orderItem: OrderItem): Promise<any> {
    return this.firestore
      .doc(`/orders/${orderItem.id}`)
      .update({ ...orderItem });
  }

  deleteOrder(orderItem: OrderItem): Promise<any> {
    return this.firestore.doc(`/orders/${orderItem.id}`).update({
      softDeleted: true,
    });
  }

  createPaymentInfo(paymentInfo: PaymentInfo): Observable<any> {
    return from(
      this.firestore
        .doc(`/payments/${paymentInfo.reference}`)
        .set({ ...paymentInfo })
    );
  }

  updatePaymentInfo(paymentInfo: PaymentInfo): Observable<any> {
    return from(
      this.firestore
        .doc(`/payments/${paymentInfo.reference}`)
        .update({ ...paymentInfo })
    );
  }

  getPaymentInfo(orderId: string): Observable<any> {
    return this.firestore.doc(`/payments/${orderId}`).valueChanges();
  }

  getAccountByUsername(username: string): Observable<any> {
    return this.firestore
      .collection(`accounts`, (ref) =>
        ref.limit(15).where('username', '==', username)
      )
      .snapshotChanges()
      .pipe(take(1));
  }

  createAccount(account: any, user: any): Observable<any> {
    let result = forkJoin([
      from(this.firestore.doc(`/accounts/${account.id}`).set({ ...account })),
      from(this.firestore.doc(`/users/${user.id}`).set({ ...user })),
    ]);
    return result;
  }

  updateOrderStatus(
    orderId: string,
    kitchenId: string,
    status: string
  ): Observable<any> {
    this.firestore.doc(`/orders/${orderId}`).update({
      status: status,
    });

    return from(
      this.firestore.doc(`/kitchen/${kitchenId}/orders/${orderId}`).update({
        status: status,
      })
    );
  }

  getKitchentOrders(kitchenId: string): Observable<any> {
    return this.firestore
      .collection(`kitchen/${kitchenId}/orders`, (ref) =>
        ref.limit(15).where('status', '!=', 'cancelled')
      )
      .snapshotChanges();
  }

  getAccountListByType(type: string): Observable<any> {
    return this.firestore
      .collection(`accounts`, (ref) => ref.limit(15).where('type', '==', type))
      .snapshotChanges()
      .pipe(take(1));
  }

  assignOrderToDispatch(dispatchRider: any, orderItem: any): Observable<any> {
    return from(
      this.firestore
        .doc(`/dispatch/${dispatchRider.id}/orders/${orderItem.id}`)
        .set({ ...orderItem })
    );
  }

  setFoodAvailability(food): Observable<any> {
    return from(
      this.firestore.doc(`/food_store/${food.id}`).update({
        availability: food.availability,
      })
    );
  }

  addFoodMenu(food): Observable<any> {
    return from(this.firestore.collection(`/food_store`).add({ ...food }));
  }

  updateFoodMenu(food): Observable<any> {
    return from(
      this.firestore.doc(`/food_store/${food.id}`).update({ ...food })
    );
  }

  getDispatchRiders() {
    return this.getAccountListByType('dispatch');
  }

  getUserAccount(accountId: string): Observable<any> {
    return this.firestore.doc(`/accounts/${accountId}`).valueChanges();
  }

  getUserAccounts(userId: string): Observable<any> {
    return this.firestore
      .collection(`accounts`, (ref) =>
        ref.where('createdBy', '==', userId).orderBy('dateCreated', 'desc')
      )
      .snapshotChanges()
      .pipe(take(1));
  }

  getUserCount(): Observable<number> {
    //console.log('auth : ' + JSON.stringify(this.authUser));
    this.authUser = this.localAuth.getUser();
    return this.firestore
      .collection<User>(`/users`, (ref) =>
        ref.where('account.id', '==', this.authUser.account.id)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((results) => {
          return results.length;
        })
      );
  }

  getCustomerCount(): Observable<number> {
    this.authUser = this.localAuth.getUser();
    return this.firestore
      .collection<Sale>(`/sales`, (ref) =>
        ref.where('accountId', '==', this.authUser.account.id)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((results) => {
          return (
            [
              ...new Set(
                results
                  .map((item) => {
                    return {
                      id: item.payload.doc.id,
                      ...item.payload.doc.data(),
                    } as Sale;
                  })
                  .map((item) => item.customerName)
              ),
            ].length || 0
          );
        })
      );
  }

  getUsers(): Observable<any> {
    return this.firestore
      .collection<User>(`/users`, (ref) =>
        ref.where('account.id', '==', this.authUser.account.id)
      )
      .snapshotChanges()
      .pipe(take(1));
  }

  getAttendantCount(): Observable<number> {
    this.authUser = this.localAuth.getUser();
    return this.firestore
      .collection(`users`, (ref) =>
        ref
          .where('role', '==', 'ATTENDANT')
          .where('account.id', '==', this.authUser.account.id)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((results) => {
          return results.length;
        })
      );
  }

  getSalesCount(): Observable<number> {
    this.authUser = this.localAuth.getUser();
    return this.firestore
      .collection<Sale>(`/sales`, (ref) =>
        ref.where('accountId', '==', this.authUser.account.id)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((results) => {
          return results.length;
        })
      );
  }

  getCustomers(): Observable<any> {
    return this.firestore
      .collection<Sale>(`/sales`, (ref) =>
        ref.where('accountId', '==', this.authUser.account.id)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((results) => {
          return [
            ...new Set(
              results
                .map((item) => {
                  return {
                    id: item.payload.doc.id,
                    ...item.payload.doc.data(),
                  } as Sale;
                })
                .map((item) => item.customerName)
            ),
          ];
        })
      );
  }

  getAttendants(): Observable<any> {
    return this.firestore
      .collection(`users`, (ref) =>
        ref
          .where('role', '==', 'ATTENDANT')
          .where('account.id', '==', this.authUser.account.id)
      )
      .snapshotChanges()
      .pipe(take(1));
  }

  getSales(filter = { limit: 100 }): Observable<any> {
    return this.firestore
      .collection<Sale>(`/sales`, (ref) =>
        ref
          .where('accountId', '==', this.authUser.account.id)
          .limit(filter['limit'])
      )
      .snapshotChanges();
  }

  filterAttendantSales(filter: string, attendantId: string): Observable<any> {
    let data = this.firestore
      .collection<Sale>(`/sales`, (ref) =>
        ref.where('attendant.id', '==', attendantId)
      )
      .snapshotChanges();
    switch (filter) {
      case 'TODAY':
        {
          let d = new Date();
          d.setHours(0, 0, 0, 0);
          var today = Timestamp.fromDate(d).seconds.toString();

          data = this.firestore
            .collection<Sale>(`/sales`, (ref) =>
              ref
                .where('attendant.id', '==', attendantId)
                .where('dateCreated', '>', today)
                .orderBy('dateCreated', 'desc')
            )
            .snapshotChanges();
        }
        break;
      case 'THIS_WEEK':
        var startOfWeek = moment()
          .startOf('week')
          .toDate()
          .getMilliseconds()
          .toString();
        var endOfWeek = moment()
          .endOf('week')
          .toDate()
          .getMilliseconds()
          .toString();

        data = this.firestore
          .collection<Sale>(`/sales`, (ref) =>
            ref
              .where('attendant.id', '==', attendantId)
              .where('dateCreated', '>=', startOfWeek)
              .where('dateCreated', '<=', endOfWeek)
              .orderBy('dateCreated', 'desc')
          )
          .snapshotChanges();
        break;
      case 'THIS_MONTH':
        var startOfMonth = moment()
          .startOf('month')
          .toDate()
          .getMilliseconds()
          .toString();
        var endOfMonth = moment()
          .endOf('month')
          .toDate()
          .getMilliseconds()
          .toString();

        data = this.firestore
          .collection<Sale>(`/sales`, (ref) =>
            ref
              .where('attendant.id', '==', attendantId)
              .where('dateCreated', '>=', startOfMonth)
              .where('dateCreated', '<=', endOfMonth)
              .orderBy('dateCreated', 'desc')
          )
          .snapshotChanges();
        break;
      case 'THIS_YEAR':
        var startOfYear = moment()
          .startOf('year')
          .toDate()
          .getMilliseconds()
          .toString();
        var endOfYear = moment()
          .endOf('year')
          .toDate()
          .getMilliseconds()
          .toString();

        data = this.firestore
          .collection<Sale>(`/sales`, (ref) =>
            ref
              .where('attendant.id', '==', attendantId)
              .where('dateCreated', '>=', startOfYear)
              .where('dateCreated', '<=', endOfYear)
              .orderBy('dateCreated', 'desc')
          )
          .snapshotChanges();
        break;
      default:
        //All
        data = this.firestore
          .collection<Sale>(`/sales`, (ref) =>
            ref.where('attendant.id', '==', attendantId)
          )
          .snapshotChanges();
        break;
    }

    return data;
  }

  getSections(): Observable<any> {
    return this.firestore
      .collection<User>(`/sections`, (ref) =>
        ref.where('accountId', '==', this.authUser.account.id)
      )
      .snapshotChanges()
      .pipe(take(1));
  }

  createSection(section: Section) {
    return from(
      this.firestore.doc(`/sections/${section.id}`).set({ ...section })
    );
  }

  deleteSection(id: string): Observable<any> {
    return from(this.firestore.doc<Section>(`/sections/${id}`).delete());
  }
}
