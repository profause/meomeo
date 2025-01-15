import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/account/login/login.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { AddUserComponent } from './pages/user/add-user/add-user.component';
import { AuthGuard } from '../shared/utils/guards/auth.guard';
import { RoleGuard } from '../shared/utils/guards/role.guard';
import { EditUserComponent } from './pages/user/edit-user/edit-user.component';
import { ListUsersComponent } from './pages/user/list-users/list-users.component';
import { ListAccountComponent } from './pages/account/list-account/list-account.component';
import { AddAccountComponent } from './pages/account/add-account/add-account.component';
import { EditAccountComponent } from './pages/account/edit-account/edit-account.component';

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
  {
    path: 'users',
    component: ListUsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      params: ['users', 'list'],
      roles: ['MANAGER', 'ADMIN'],
    },
  },
  {
    path: 'users/add',
    component: AddUserComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      params: ['users', 'add'],
      roles: ['MANAGER', 'ADMIN'],
    },
  },
  {
    path: 'users/edit/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      params: ['users', 'edit'],
      roles: ['MANAGER', 'ADMIN'],
    },
  },
  {
    path: 'account/add',
    component: AddAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'accounts',
    component: ListAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account/edit/:id',
    component: EditAccountComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', redirectTo: 'account/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'account/register', pathMatch: 'full' },

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
  EditUserComponent,
  AddUserComponent,
  ListUsersComponent,
  ListAccountComponent,
  AddAccountComponent,
  EditAccountComponent,
];
