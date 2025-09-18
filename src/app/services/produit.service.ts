import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  constructor(private http: HttpClient) { }

  getProduits() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${environment.apiUrl}/produits`, { headers });
  }
}
