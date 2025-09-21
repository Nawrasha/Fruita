import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  constructor(private http: HttpClient) { }

  getProduits() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${environment.apiUrl}/products`, { headers });
  }


  deleteProduit(id: number): Observable<void> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`, { headers });
  }

  updateProduit(id: number, produit: any): Observable<any> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.put(`${environment.apiUrl}/products/${id}`, produit, { headers });
  }

  addProduit(produit: any) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.post(`${environment.apiUrl}/products`, produit, { headers });
  }

}
