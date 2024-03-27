import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../utils/authorization-guard.service';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { SearchItemComponent } from './search-item/search-item.component';


const routes: Routes = [
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'searchItem',
    component: SearchItemComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule { }
