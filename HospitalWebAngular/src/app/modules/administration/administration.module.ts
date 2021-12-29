import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { PatientsPage } from './pages/patients/patients.page';
import { DoctorsPage } from './pages/doctors/doctors.page';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    PatientsPage,
    DoctorsPage
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SharedModule
  ]
})
export class AdministrationModule { }
