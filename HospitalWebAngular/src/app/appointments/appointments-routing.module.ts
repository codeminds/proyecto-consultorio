import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsPage } from './pages/appointments/appointments.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsPage,
    data: { title: 'Citas' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
