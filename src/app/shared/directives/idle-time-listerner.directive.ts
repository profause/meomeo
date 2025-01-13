import { Directive, HostListener, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { LocalAuthService } from '../services/local-auth.service';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { AlertType } from '../services/alert.service';

@Directive({
  selector: '[appIdleTimeListerner]'
})
export class IdleTimeListernerDirective {

  private timeout : any;
   userInactive: Subject<any> = new Subject();
   idleTimerThreshold = 900000
  constructor(private router: Router,private localAuthService: LocalAuthService,
    private appMaterialComponent: AppMaterialDesignModule,) {
    this.resetIdleTimeout();
    this.userInactive.subscribe(() => {
      localAuthService.signOut()
      this.appMaterialComponent.showAlertToaster(AlertType.info, `logged out for being idle...`, 5)
      this.router.navigate(['users/login'], { queryParams: {}, skipLocationChange: false });
    });  
  }

  private resetIdleTimeout(){
    this.timeout = setTimeout(() => {
      if (this.localAuthService.getUser().id) {
        this.userInactive.next(undefined);
        console.log('logged out for being idle...');
      }
    }, this.idleTimerThreshold);
  }
  @HostListener('document:keydown')
  @HostListener('window:mousemove') resetUserState() {
    clearTimeout(this.timeout);
    this.resetIdleTimeout();
  }

}
