import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrderItem } from '../models/order-item';
import { PaymentInfo } from '../models/payment-info';
import { Setting } from '../models/setting';
import { User } from '../models/user.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient,
    private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getDeliveryLocations(): Observable<any> {
    return this.firestore.collection(`locations`, ref => ref.limit(15)).snapshotChanges().pipe(take(1));
  }

  getFoodList(): Observable<any> {
    return this.firestore.collection(`food_store`, ref => ref.limit(15)).snapshotChanges().pipe(take(1));
  }

  getFoodItemImage(filePath: string) {
    const gsReference = this.storage.refFromURL(filePath);
    //const storageRef = this.storage.ref('foods/');
    return gsReference.getDownloadURL();
  }

  getOrderItemList(userId: string): Observable<any> {
    return this.firestore.collection(`orders`, ref => ref.limit(15)
      .where(
        'user_id', '==', userId
      )//.where(
      //   'softDelete', '==', false
      // )
    ).snapshotChanges();
  }

  getOrderItem(orderId: string): Observable<any> {
    return this.firestore.doc(`/orders/${orderId}`).valueChanges();
  }

  createUser(user: User): Observable<any> {
    return from(this.firestore.doc(`/users/${user.id}`).set({ ...user }));
  }

  updateUser(user: User): Observable<any> {
    return from(this.firestore.doc(`/users/${user.id}`).update({ ...user })).pipe(take(1));
  }

  getUser(user_id: string): Observable<any> {
    return this.firestore.doc(`/users/${user_id}`).valueChanges().pipe(take(1));
  }

  getUserByMobileNumber(mobileNumber: string): Observable<any> {
    return this.firestore.collection(`users`, ref => ref.limit(15)
      .where(
        'mobileNumber', '==', mobileNumber
      )
    ).snapshotChanges().pipe(take(1));
  }

  setUserAppSettings(setting: Setting): Promise<any> {
    //console.log('setUserAppSettings')
    return this.firestore.doc(`/settings/${setting.user_id}`).set({ ...setting });
  }

  getUserAppSettings(user_id: string): Observable<any> {
    //console.log('hhhrrerer')
    return this.firestore.doc(`/settings/${user_id}`).valueChanges();
  }

  createOrder(orderItem: OrderItem): Observable<any> {
    return from(this.firestore.doc(`/orders/${orderItem.id}`).set({ ...orderItem }));
  }

  updateOrder(orderItem: OrderItem): Promise<any> {
    return this.firestore.doc(`/orders/${orderItem.id}`).update({ ...orderItem });
  }

  deleteOrder(orderItem: OrderItem): Promise<any> {
    return this.firestore.doc(`/orders/${orderItem.id}`).update({
      softDeleted: true
    });
  }

  createPaymentInfo(paymentInfo: PaymentInfo): Observable<any> {
    return from(this.firestore.doc(`/payments/${paymentInfo.reference}`).set({ ...paymentInfo }));
  }

  updatePaymentInfo(paymentInfo: PaymentInfo): Observable<any> {
    return from(this.firestore.doc(`/payments/${paymentInfo.reference}`).update({ ...paymentInfo }));
  }

  getPaymentInfo(orderId: string): Observable<any> {
    return this.firestore.doc(`/payments/${orderId}`).valueChanges();
  }

  getAccountByUsername(username: string): Observable<any> {
    return this.firestore.collection(`accounts`, ref => ref.limit(15)
      .where(
        'username', '==', username
      )
    ).snapshotChanges().pipe(take(1));
  }

  createAccount(account: any, user: any): Observable<any> {
    let result = forkJoin([
      from(this.firestore.doc(`/accounts/${account.id}`).set({ ...account })),
      from(this.firestore.doc(`/users/${user.id}`).set({ ...user })),
    ]);
    return result;
  }

  updateOrderStatus(orderId: string, kitchenId: string, status: string): Observable<any> {
    this.firestore.doc(`/orders/${orderId}`).update({
      status: status
    });

    return from(this.firestore.doc(`/kitchen/${kitchenId}/orders/${orderId}`).update({
      status: status
    }));

  }

  getKitchentOrders(kitchenId: string): Observable<any> {
    return this.firestore.collection(`kitchen/${kitchenId}/orders`, ref => ref
      .limit(15)
      .where(
        'status', '!=', 'cancelled'
      )
    )
      .snapshotChanges();
  }

  getAccountListByType(type: string): Observable<any> {
    return this.firestore.collection(`accounts`, ref => ref.limit(15)
      .where(
        'type', '==', type
      )
    ).snapshotChanges().pipe(take(1));
  }

  assignOrderToDispatch(dispatchRider: any, orderItem: any): Observable<any> {
    return from(this.firestore.doc(`/dispatch/${dispatchRider.id}/orders/${orderItem.id}`).set({ ...orderItem }));
  }

  setFoodAvailability(food): Observable<any> {
    return from(this.firestore.doc(`/food_store/${food.id}`).update({
      availability: food.availability
    }));
  }

  addFoodMenu(food): Observable<any> {
    return from(this.firestore.collection(`/food_store`).add({ ...food }));
  }

  updateFoodMenu(food): Observable<any> {
    return from(this.firestore.doc(`/food_store/${food.id}`).update({ ...food }));
  }

  getDispatchRiders(){
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
}
