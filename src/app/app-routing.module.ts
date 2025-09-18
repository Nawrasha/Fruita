import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './pages/profile/login/login.component';
import { InscriptionComponent } from './pages/profile/inscription/inscription.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserInterfaceComponent } from './user/user-interface/user-interface.component';
import { settings } from 'cluster';
import { SettingsComponent } from './pages/profile/settings/settings.component';


const routes: Routes = [
  {path:'', component:LoginComponent},
  {path: 'login', component: LoginComponent },
  {path:'inscription', component:InscriptionComponent},

  {path:'admin/dashboard', component:DashboardComponent, canActivate:[AuthGuard], data:{role:'admin'}},
  {
    path: 'user',
    component: UserInterfaceComponent,
    canActivate: [AuthGuard],
    data: { role: 'user' },
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full' }, 
      { path: 'home', component: HomeComponent },
      {path:'menu/:categorie', component:MenuComponent},
      {path: 'menu', redirectTo: 'menu/Smoothie', pathMatch: 'full' },
      {path:'settings', component:SettingsComponent}
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
