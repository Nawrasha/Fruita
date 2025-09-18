import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onLogout() {
    this.auth.logout();              // 1) vider rôle/token
    this.router.navigate(['/login']); // 2) rediriger
  }

}
