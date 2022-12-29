import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfilePage } from './pages/profile/profile.page';
import { SessionsPage } from './pages/sessions/sessions.page';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    ProfilePage,
    SessionsPage
  ],
  imports: [
    SharedModule,
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
