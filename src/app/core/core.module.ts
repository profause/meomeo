import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingComponents, CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { AppMaterialDesignModule } from '../app-material-design.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    CoreRoutingComponents
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    AppMaterialDesignModule,
    SharedModule
  ]
})
export class CoreModule { }
