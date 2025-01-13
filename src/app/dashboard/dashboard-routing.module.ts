import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AttendantComponent } from './attendant/attendant.component';
import { ManagerComponent } from './manager/manager.component';
import { AuthGuard } from '../shared/utils/guards/auth.guard';
import { RoleGuard } from '../shared/utils/guards/role.guard';

const routes: Routes = [
  {
    path: 'dashboard/admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { params: ['dashboard', 'admin'], roles: ['ADMIN', 'SYS_ADMIN'] },
  },
  {
    path: 'dashboard/manager',
    component: ManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      params: ['dashboard', 'manager'],
      roles: ['MANAGER', 'ACCOUNTANT','ADMIN'],
    },
  },
  {
    path: 'dashboard/attendant',
    component: AttendantComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { params: ['dashboard', 'attendant'], roles: ['ATTENDANT','ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
