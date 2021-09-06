import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { ArrestComponent } from './features/arrest/arrest.component';
import { CaseComponent } from './features/case/case.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'main',
    component: LayoutComponent,
    canActivate: [AuthGuard],
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
  { path: 'PageNotFound', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
