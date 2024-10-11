import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JwtAuthService } from '../jwt-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class NavbarComponent {

  page: string;
  isAdmin: boolean = false; // Initialize isAdmin to avoid undefined value
  hide: boolean = false; // Initialize hide properly

  constructor(public auth: JwtAuthService, public router: Router) {
    this.page = this.router.url.substring(1);

    // Subscribe to the currentUser observable and check if user is valid
    this.auth.currentUser.subscribe(data => {
      if (data && data.user) { // Check if data is not null and data.user exists
        this.isAdmin = data.user === "admin";
      } else {
        this.isAdmin = false; // Reset isAdmin if there's no user
      }
    });
  }

  signOut() {
    this.router.navigateByUrl('/login');
    this.auth.logout();
  }
}
