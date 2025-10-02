import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${environment.apiUrl}/users`, { headers });
  }

  deleteUser(id: number) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.delete(`${environment.apiUrl}/users/${id}`, { headers });
  }

  updateUser(id: number, userData: any) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.put(`${environment.apiUrl}/users/${id}`, userData, { headers });
  }

  addUser(userData: any) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.post(`${environment.apiUrl}/users`, userData, { headers });
  }

  rechercherUsers(motCle: string) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${environment.apiUrl}/users/search?search=${motCle}`, { headers });
  }

}

