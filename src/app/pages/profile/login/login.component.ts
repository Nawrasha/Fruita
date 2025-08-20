import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginData } from '../../../services/auth.service';

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

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.loading) { return; }
    this.messageErreur = '';
    const data: LoginData = { email: this.email.trim(), password: this.password };

    this.loading = true;
    this.auth.login(data).subscribe({
      next: (res) => {
        this.auth.setUtilisateurConnecte(res.admin);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.messageErreur = err?.error?.message || 'Erreur de connexion';
        this.loading = false;
      }
    });
  }
}