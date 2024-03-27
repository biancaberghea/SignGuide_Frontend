import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { ProfileRoutingModule } from './profile-routing';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ProfileRoutingModule,
    NgCircleProgressModule.forRoot({
      backgroundPadding: 8,
      radius: 60,
      space: -15,
      maxPercent: 100,
      unitsColor: "#7d7fe8",
      outerStrokeWidth: 10,
      outerStrokeColor: "rgba(30,39,97)",
      innerStrokeColor: "#7d7fe8",
      innerStrokeWidth: 10,
      titleColor: "#7d7fe8",
      subtitleColor: "#7d7fe8",
      animationDuration: 400
    }),
  ],
  providers: [
  ]
})
export class ProfileModule { }
