import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';  // Import your route configuration

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],  // Use forRoot to configure routing
  exports: [RouterModule],
})
export class AppRoutingModule {}

// import { AppComponent } from './app.component';


// const routes: Routes = [
//   { path: '/', component: AppComponent }
// ];
