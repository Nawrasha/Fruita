import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../../../services/auth.service';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  messageErreur = '';
  loading = false;

  constructor(private auth: AuthService,
    private produitService: ProduitService,
     private router: Router) {}

  onSubmit(): void {
    if (this.loading) { return; }
    this.messageErreur = '';
    const data: LoginData = { email: this.email.trim(), password: this.password };

    this.loading = true;
    this.auth.login(data).subscribe({
      next: (res) => {
        console.log('Réponse du serveur:', res);
        this.auth.setToken(res.token);
        this.auth.setUtilisateurConnecte(res.user);
        
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
          console.log('Navigating to admin dashboard');
          console.log('User role:', res.user.role);
          
        }else if (res.user.role === 'user')  {
          this.router.navigate(['/user/home']);
        }
         else  {
          this.router.navigate(['/login']);
        }
        this.loading = false;
      },

      error: (err) => {
        this.messageErreur = err?.error?.message || 'Erreur de connexion';
        this.loading = false;
      }
    });
  }
}