import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsPage } from './pages/appointments/appointments.page';
import { DoctorsPage } from './pages/doctors/doctors.page';
import { PatientsPage } from './pages/patients/patients.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsPage,
    data: { title: 'Citas' }
  },
  {
    path: 'doctors',
    component: DoctorsPage,
    data: { title: 'Doctores' }
  },
  {
    path: 'patients',
    component: PatientsPage,
    data: { title: 'Pacientes' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
