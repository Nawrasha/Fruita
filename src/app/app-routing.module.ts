import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './pages/profile/login/login.component';
import { InscriptionComponent } from './pages/profile/inscription/inscription.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './admin/dashboard/dashboard.component';


const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'menu/:categorie', component:MenuComponent},
  {path: 'menu', redirectTo: 'menu/Smoothie', pathMatch: 'full' },
  {path:'login', component:LoginComponent},
  {path:'inscription', component:InscriptionComponent},
  {path:'admin/dashboard', component:DashboardComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
