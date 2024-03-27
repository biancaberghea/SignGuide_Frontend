import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../utils/authorization-guard.service';
import { DisplayVideoComponent } from './display-video/display-video.component';


const routes: Routes = [
  {
    path: 'video/:catName',
    component: DisplayVideoComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayVideoRoutingModule { }
