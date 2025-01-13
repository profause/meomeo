import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemSetupComponent } from './system-setup/system-setup.component';
import { AuthGuard } from '../shared/utils/guards/auth.guard';
import { RoleGuard } from '../shared/utils/guards/role.guard';

const routes: Routes = [
  {
    path: 'admin/system-setup',
    component: SystemSetupComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { params: ['system-setup', 'admin'], roles: ['ADMIN', 'SYS_ADMIN'] },
  },

  {
    path: 'admin/setup',
    component: SystemSetupComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { params: ['setup', 'admin'], roles: ['ADMIN', 'SYS_ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
