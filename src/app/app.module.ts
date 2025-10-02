import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './pages/profile/login/login.component';
import { InscriptionComponent } from './pages/profile/inscription/inscription.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserInterfaceComponent } from './user/user-interface/user-interface.component';
import { SettingsComponent } from './pages/profile/settings/settings.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { CartComponent } from './pages/cart/cart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    LoginComponent,
    InscriptionComponent,
    NavBarComponent,
    DashboardComponent,
    UserInterfaceComponent,
    SettingsComponent,
    ProductManagementComponent,
    SidebarComponent,
    UserManagementComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }