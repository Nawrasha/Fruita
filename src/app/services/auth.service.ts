import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Utilisateur {
  id: number;
  nom_complet: string;
  email: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nom_complet: string;
  role: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private utilisateurConnecte: Utilisateur | null = null;
  
  constructor(private http: HttpClient) {
    // Récupérer l'utilisateur connecté depuis le localStorage au démarrage
    const utilisateurStocke = localStorage.getItem('utilisateur');
    if (utilisateurStocke) {
      this.utilisateurConnecte = JSON.parse(utilisateurStocke);
    }
  }

  // Méthode d'inscription
  register(data: RegisterData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, data);
  }

  // Méthode de connexion
  login(data: LoginData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, data);
  }

  // Méthode pour stocker l'utilisateur connecté
  setUtilisateurConnecte(utilisateur: Utilisateur): void {
    this.utilisateurConnecte = utilisateur;
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
  }
  // Méthode pour stocker le token
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Méthode pour récupérer l'utilisateur connecté
  getUtilisateurConnecte(): Utilisateur | null {
    return this.utilisateurConnecte;
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  estConnecte(): boolean {
    return this.utilisateurConnecte !== null;
  }
  getUserProfile(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${environment.apiUrl}/profile`);
  }

  // Méthode de déconnexion
  logout(): void {
    this.utilisateurConnecte = null;
    localStorage.removeItem('utilisateur');
  }

  isAdmin(): boolean {
    const user = this.getUtilisateurConnecte();
    return user?.role === 'admin'; // true si rôle = 'admin'
  }
}

