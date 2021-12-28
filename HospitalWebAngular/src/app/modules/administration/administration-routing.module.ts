import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorsPage } from './pages/doctors/doctors.page';
import { PatientsPage } from './pages/patients/patients.page';

const routes: Routes = [
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
export class AdministrationRoutingModule { }
