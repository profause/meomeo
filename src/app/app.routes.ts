import { Routes } from '@angular/router';
// import { AppComponent } from './app.component';
import { IndexComponent } from './pages/public/index/index.component';

export const appRoutes: Routes = [
  { path: '', component: IndexComponent },  // Set IndexComponent as the default page
//   { path: '/', component: IndexComponent }, // Example route for login

];
