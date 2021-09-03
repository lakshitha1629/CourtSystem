import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArrestComponent } from './features/arrest/arrest.component';
import { CaseComponent } from './features/case/case.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'arrestDetails',
        component: ArrestComponent,
      },
      {
        path: 'caseDetails',
        component: CaseComponent,
      },
    ],
  },
  {
    path: 'login',
    component: UserLoginComponent,
  },
  {
    path: 'registration',
    component: UserRegistrationComponent,
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
