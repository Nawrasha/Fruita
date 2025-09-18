import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterData } from '../../../services/auth.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  nom_complet = '';
  email = '';
  password = '';
  role = '';
  loading = false;
  messageErreur = '';
  messageSucces = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.loading) { return; }
    this.messageErreur = '';
    this.messageSucces = '';

    const data: RegisterData = {
      nom_complet: this.nom_complet.trim(),
      role: this.role.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.loading = true;
    this.auth.register(data).subscribe({
      next: () => {
        this.messageSucces = 'Inscription réussie. Vous pouvez vous connecter.';
        this.loading = false;
        // this.router.navigateByUrl('/login'); // Décommentez si vous voulez rediriger directement
      },
      error: (err) => {
        this.messageErreur = err?.error?.message || 'Erreur lors de l’inscription';
        this.loading = false;
      }
    });
    console.log(this.nom_complet, this.email, this.password, this.role);
  }
}