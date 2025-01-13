import * as JsEncryptModule from 'jsencrypt';
import { environment } from 'src/environments/environment';

export class Utils {
  constructor() {}

  static generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  public static encrypt(payload: string): string {
    const publicKey = environment.publicKey;
    const JsEncrypt = new JsEncryptModule.JSEncrypt();
    JsEncrypt.setPublicKey(publicKey);
    return JsEncrypt.encrypt(payload.trim()) as string;
  }

  public static decrypt(payload: string): string {
    const publicKey = environment.publicKey;
    const privateKey = environment.privateKey;
    const JsEncrypt = new JsEncryptModule.JSEncrypt();
    JsEncrypt.setPublicKey(publicKey);
    JsEncrypt.setPrivateKey(privateKey);
    return JsEncrypt.decrypt(payload.trim()) as string;
  }

  public static getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date().toDateString());
    var seconds = Math.floor((t / 1000) % 60);
    //var minutes = Math.floor((t / 1000 / 60) % 60);
    //var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    //var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      'total': t,
      //'days': days,
      //'hours': hours,
      //'minutes': minutes,
      'seconds': seconds
    };
  }
}
