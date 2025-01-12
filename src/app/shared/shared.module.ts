import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService } from './services/backend.service';
import { DataService } from './services/data.service';
import { FormBuilderService } from './services/form-builder.service';
import { LocalAuthService } from './services/local-auth.service';
import { WindowService } from './services/window.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppMaterialDesignModule } from '../app-material-design.module';
import { AssignDispatchDialogComponent } from './components/assign-dispatch-dialog/assign-dispatch-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FoodMenuDialogComponent } from './components/food-menu-dialog/food-menu-dialog.component';
import { MaterialProgressDialogComponent } from './components/material-progress-dialog/material-progress-dialog.component';



@NgModule({
  declarations: [
    MaterialProgressDialogComponent,
    ConfirmDialogComponent,
    AssignDispatchDialogComponent,
    FoodMenuDialogComponent
  ],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    AppMaterialDesignModule,
  ],providers: [
    BackendService,
    WindowService,
    LocalAuthService,
    DataService,
    FormBuilderService,
  ],
  

})
export class SharedModule { }
