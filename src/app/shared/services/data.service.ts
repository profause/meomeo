import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private listners = new BehaviorSubject('default message');
  private dataSource = new BehaviorSubject('default message');
  public currentdata: Observable<any> = this.dataSource.asObservable();

  constructor() { }

  setData(data) {
    this.dataSource.next(data);
  }


  listen(): Observable<any> {
     return this.listners.asObservable();
  }

  filter(filterBy: string) {
     this.listners.next(filterBy);
  }

  formatAmount(amount): string {
    return parseInt(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

}
