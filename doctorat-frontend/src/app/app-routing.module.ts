import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { InscriptionListComponent } from './inscriptions/inscription-list/inscription-list.component';
import { InscriptionCreateComponent } from './inscriptions/inscription-create/inscription-create.component';
import { InscriptionEditComponent } from './inscriptions/inscription-edit/inscription-edit.component';
import { InscriptionDetailComponent } from './inscriptions/inscription-detail/inscription-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/create', component: UserCreateComponent },
  { path: 'users/edit/:id', component: UserEditComponent },
  { path: 'users/profile/:id', component: UserProfileComponent },
  { path: 'inscriptions', component: InscriptionListComponent },
  { path: 'inscriptions/create', component: InscriptionCreateComponent },
  { path: 'inscriptions/edit/:id', component: InscriptionEditComponent },
  { path: 'inscriptions/detail/:id', component: InscriptionDetailComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

