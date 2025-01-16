import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SystemSetupComponent } from './system-setup/system-setup.component';
import { AppMaterialDesignModule } from '../app-material-design.module';
import { SharedModule } from '../shared/shared.module';
import { AccountSetupComponent } from './account-setup/account-setup.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { LayoutComponent } from './layout/layout.component';
import { LabelsAndQrComponent } from './labels-and-qr/labels-and-qr.component';


@NgModule({
  declarations: [
    SystemSetupComponent,
    AccountSetupComponent,
    SubscriptionComponent,
    LayoutComponent,
    LabelsAndQrComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialDesignModule,
    SharedModule,
  ]
})
export class AdminModule { }
