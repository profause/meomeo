import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  private authSource = new BehaviorSubject<User>({ id: '' });
  public user: Observable<User> = this.authSource.asObservable();

  constructor(private fireAuth: AngularFireAuth) {
    this.fireAuth.authState.subscribe({
      next: (authUser) => {
        let user: User = {
          id: authUser?.uid,
          mobileNumber: authUser?.phoneNumber,
          fullname: authUser?.displayName || '',
          email: authUser?.email || ''
        }

        //this.setUser(user);
      }
    })
  }

  setUser(user: User): boolean {
    if (user !== null) {
      localStorage.setItem('authUser', JSON.stringify(user));
      this.authSource.next(user);
    }
    return true;
  }

  getAuthUser(): User {
    let user = JSON.parse(localStorage.getItem('authUser'));
    return user;
  }

  public signOut(): Promise<void> {
    localStorage.setItem('authUser',null);
    return this.fireAuth.signOut();
  }
}
