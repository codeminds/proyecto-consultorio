import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsPage } from './pages/appointments/appointments.page';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    AppointmentsPage
  ],
  imports: [
    SharedModule,
    CommonModule,
    AppointmentsRoutingModule
  ]
})
export class AppointmentsModule { }
