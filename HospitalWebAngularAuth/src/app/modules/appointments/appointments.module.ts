import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsPage } from './pages/appointments/appointments.page';
import { SharedModule } from '@shared/shared.module';
import { DoctorsPage } from './pages/doctors/doctors.page';
import { PatientsPage } from './pages/patients/patients.page';


@NgModule({
  declarations: [
    AppointmentsPage,
    DoctorsPage,
    PatientsPage
  ],
  imports: [
    SharedModule,
    CommonModule,
    AppointmentsRoutingModule
  ]
})
export class AppointmentsModule { }
