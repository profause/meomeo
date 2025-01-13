import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ManagerComponent } from './manager/manager.component';
import { AdminComponent } from './admin/admin.component';
import { AttendantComponent } from './attendant/attendant.component';
import { AppMaterialDesignModule } from '../app-material-design.module';
import { SharedModule } from '../shared/shared.module';
import { BdcWalkModule } from 'bdc-walkthrough';


@NgModule({
  declarations: [
    ManagerComponent,
    AdminComponent,
    AttendantComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AppMaterialDesignModule,
    SharedModule,
    BdcWalkModule
  ]
})
export class DashboardModule { }
