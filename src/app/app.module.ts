import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component'; // Import your standalone component
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module'; // Import AppRoutingModule

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppComponent, // Import AppComponent as it is standalone
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }],
})
export class AppModule { }
