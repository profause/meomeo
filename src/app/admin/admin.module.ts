import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SystemSetupComponent } from './system-setup/system-setup.component';
import { AppMaterialDesignModule } from '../app-material-design.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SystemSetupComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppMaterialDesignModule,
    SharedModule,
  ]
})
export class AdminModule { }
