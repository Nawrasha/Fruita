import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //     const user = localStorage.getItem('Utilisateur');
  //     if (!user) {
  //       return false;
  //     }
  //     return true;
  // }

  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const userRole = this.auth.getRole();

    if (!this.auth.estConnecte() || userRole !== expectedRole) {
      this.router.navigate(['/login']); 
      return false;
    }

    return true;
  }
}
