import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'account/login',
    component: LoginComponent,
  },
  {
    path: 'account/register',
    component: RegisterComponent,
  },

  { path: 'login',   redirectTo: 'account/login', pathMatch: 'full' },
  { path: 'register',   redirectTo: 'account/register', pathMatch: 'full' },

  //{ path: '**', pathMatch: 'full', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
export const CoreRoutingComponents = [
  HomeComponent,
  LoginComponent,
  RegisterComponent,
];
