import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppMaterialDesignModule } from './app-material-design.module';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import * as firebase from 'firebase/app';
import { DashboardModule } from './dashboard/dashboard.module';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    AngularFireAuthModule,
    AppMaterialDesignModule,
    SharedModule,
    AdminModule,
    CoreModule,
    DashboardModule
  ],
  providers: [
    {provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig},
    
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
