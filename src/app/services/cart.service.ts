import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  addToCart(productId: number) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    const userId = localStorage.getItem('userId');
    const item = { userId, productId };
    return this.http.post(`${environment.apiUrl}/cart`, item, { headers });
  }

  getCartItems() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    console.log('Appel getCartItems');
    return this.http.get(`${environment.apiUrl}/cart`, { headers });
  }

  updateQuantity(cartitemID: number, quantity: number) {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  return this.http.put(`${environment.apiUrl}/cart/${cartitemID}`, { quantity }, { headers });
}

  removeFromCart(cartitemID: number) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.delete(`${environment.apiUrl}/cart/${cartitemID}`, { headers });
  }

}
