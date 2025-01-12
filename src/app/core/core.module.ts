import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingComponents, CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';


@NgModule({
  declarations: [
    CoreRoutingComponents
  ],
  imports: [
    CommonModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }
