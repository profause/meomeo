import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { Utils } from '../utils/utils';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  private authSource = new BehaviorSubject<User>({ id: '' });
  public user: Observable<User> = this.authSource.asObservable();


  constructor(private fireAuth: AngularFireAuth) {
    this.fireAuth.onAuthStateChanged((result) => {
      //console.log('result : ' + JSON.stringify(result))
      if (!result) {
        this.defaultLogin();
      }
    });
  }

  public defaultLogin() {
    const u = Utils.decrypt(environment.username);
    const p = Utils.decrypt(environment.password);
    //console.log('result : ' + u)
    this.fireAuth
      .signInWithEmailAndPassword(u, p)
      .then((result) => {
        //console.log('result : ' + JSON.stringify(result.user))
        //this.setUser(result.user)
      })
      .catch((error: any) => {
        console.log(error, 'Incorrect code entered');
      });
  }

  setUser(user: User): boolean {
    if (user !== null) {
      localStorage.setItem('authUser', JSON.stringify(user));
      this.authSource.next(user);
    } else {
      user = {};
      localStorage.setItem('authUser', JSON.stringify(user));
      this.authSource.next(user);
    }
    return true;
  }

  setUserEncrypted(user: User): boolean {
    if (user !== null) {
      const a = user.account;
      delete user.account;
      const ae = Utils.encrypt(JSON.stringify(a));
      const ue = Utils.encrypt(JSON.stringify(user));
      const authUser = {
        user: ue,
        account: ae,
      };
      localStorage.setItem('authUser', JSON.stringify(authUser));
      this.authSource.next(user);
    } else {
      user = {};
      localStorage.setItem('authUser', JSON.stringify(user));
      this.authSource.next(user);
    }
    return true;
  }

  getUser(): User {
    //console.log('getUser '+localStorage.getItem('authUser'));
    return JSON.parse(localStorage.getItem('authUser')) || {};
  }

  getUserDecrypted(): User {
    //console.log('getUser '+localStorage.getItem('authUser'));
    const authUser = JSON.parse(localStorage.getItem('authUser')) || {};
    const account = JSON.parse(Utils.decrypt(authUser['account']));
    let user = JSON.parse(Utils.decrypt(authUser['user'])) as User;
    user.account = account;
    return user;
  }

  getAuthUser(): Observable<User> {
    //console.log('getUser '+localStorage.getItem('authUser'));
    //return JSON.parse(localStorage.getItem('authUser')) || new AuthUser();
    this.authSource.next(JSON.parse(localStorage.getItem('authUser')) || {});
    return this.authSource.asObservable();
  }

  isAuthenticated() {
    return this.getUser().isAuthenticated;
  }

  public register(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  public login(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  public signOut(): Promise<void> {
    this.setUser(null);
    return this.fireAuth.signOut();
  }

  public updateUser(user: User) {
    // this.fireAuth.currentUser
    // .updateProfile({
    //   displayName: user.fullname,
    //   photoURL: user.profileImage,
    // });
    //tempUser.updateEmail(user.email);
    //phoneCredential: this.fireAuth.auth.AuthCredential
    //tempUser.updatePhoneNumber(user.mobileNumber);
  }

  public isAdmin(): boolean {
    if (this.getUser().id === '0') {
      return false;
    }
    let isAdmin =
      this.getUser().role.toLowerCase() === 'admin' ||
      this.getUser().role.toLowerCase() === 'sys_admin';
    return isAdmin;
  }
}
