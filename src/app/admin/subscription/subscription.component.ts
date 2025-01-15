import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AppMaterialDesignModule } from 'src/app/app-material-design.module';
import { User } from 'src/app/shared/models/user.interface';
import { BackendService } from 'src/app/shared/services/backend.service';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy{

  public isLoading = false;
  public authUser: User;
  private unSubscriptioNotifier = new Subject();
  
  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private appMaterialComponent: AppMaterialDesignModule,
    private localAuth: LocalAuthService,
    private backend: BackendService,
  ){
    this.authUser = localAuth.getUser();
  }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      this.unSubscriptioNotifier.next('');
      this.unSubscriptioNotifier.complete()
  }
}
