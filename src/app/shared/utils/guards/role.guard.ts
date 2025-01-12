import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
//import { LocalAuthService } from 'src/app/services/local-auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let params = next.data.params as Array<string>;

    // if (!this.localAuthService.isAuthenticated()) {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    
    // if (this.localAuthService.isAdmin())
    //   return true;

    // if (!this.localAuthService.hasPermission(params[0], params[1])) {
    //   this.router.navigate(['/login']);
    //   return false;
    // }

    return true;
  }

}
