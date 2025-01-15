import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalAuthService } from 'src/app/shared/services/local-auth.service';

@Component({
  selector: 'app-system-setup',
  templateUrl: './system-setup.component.html',
  styleUrls: ['./system-setup.component.scss'],
})
export class SystemSetupComponent implements OnInit {
  public tab: string = 'account';

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private localAuth: LocalAuthService
  ) {}

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.tab = params['tab'] || '0';
    });
  }
}
