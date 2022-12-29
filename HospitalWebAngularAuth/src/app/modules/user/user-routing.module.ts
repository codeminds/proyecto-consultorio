import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePage } from './pages/profile/profile.page';
import { SessionsPage } from './pages/sessions/sessions.page';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfilePage,
    data: { title: 'Perfil' }
  },
  {
    path: 'sessions',
    component: SessionsPage,
    data: { title: 'Sesiones' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
