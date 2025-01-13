import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface DialogOptions {
  title?: string
  message?: string
  isHtmlContent?:boolean | false
  width?: string
  height?: string
  data?: any
  buttonText?:any
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private subject = new Subject<any>();
  constructor() { }

  sendMessage(message: any) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next('');
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}

export const enum DialogButton {
  cancel = 'cancel',
  close = 'close',
  ok = 'ok',
  upload = 'upload',
}

export const enum DialogType {
  success = 'success',
  error = 'error',
  info = 'info',
  warn = 'warn'
}
