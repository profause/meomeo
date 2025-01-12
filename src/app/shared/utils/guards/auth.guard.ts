import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalAuthService } from '../../services/local-auth.service';
//import { LocalAuthService } from 'src/app/services/local-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private firebaseAuth: AngularFireAuth,
    private localAuthService: LocalAuthService,
    private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      if(undefined==this.localAuthService.getAuthUser()){
        this.router.navigate(['/login']);
        return false;
      }
      if (!this.localAuthService.getAuthUser().id) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
  }
}
