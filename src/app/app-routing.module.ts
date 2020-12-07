import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router'
import { pagesRoutingModule } from './pages/pages.routing';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { AuthRouterModule } from './auth/auth.routing';


const routes: Routes=[

  //path: '/dashboard' PagesRouting
  //path: '/Auth' AuthRouting
  {path: '', redirectTo: '/dashboard', pathMatch:'full'},
  {path: '**', component: NopagefoundComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    pagesRoutingModule,
    AuthRouterModule
  ],
  exports:[RouterModule]

})
export class AppRoutingModule { }
