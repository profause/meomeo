import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();
  public show: Observable<any> = this.subject.asObservable();

  constructor() { }

  public showAlert(alertType, message: string) {
    this.subject.next({
      showAlert: true,
      alertType: alertType,
      message: message
    });
  }

  public dismissAlert() {
    this.subject.next({
      showAlert: false,
      alertType: '',
      message: ''
    });
  }

}

export const enum AlertType {
  success = 'success',
  error = 'error',
  info = 'info',
  warn = 'warn'
}