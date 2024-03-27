import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'home',
    loadChildren: () => import('./apps/home-page/home.module').then((m) => m.HomeModule),
  },

  {
    path: 'profile',
    loadChildren: () => import('./apps/profile/profile.module').then((m) => m.ProfileModule),
  },

  {
    path: 'video',
    loadChildren: () => import('./apps/display-video/display-video.module').then((m) => m.DisplayVideoModule),
  },

  {
    path: 'admin',
    loadChildren: () => import('./apps/admin-page/admin-page.module').then((m) => m.AdminPageModule),
  },

  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
