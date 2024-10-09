import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JwtAuthService } from '../jwt-auth.service';
import { CommonModule, NgIf } from '@angular/common';

CommonModule
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(public auth: JwtAuthService, public router: Router) {
    this.page = this.router.url.substring(1);
    this.auth.currentUser.subscribe(data => {
      this.isAdmin = data.user == "admin"
    })
  }

  page: string;
  isAdmin: Boolean;
  hide: false //this hides navlinks

  signOut() {
    this.router.navigateByUrl('/login');
    this.auth.logout();
  }
}
