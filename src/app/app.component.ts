import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JwtAuthService } from './jwt-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'warships2024';

  constructor(public auth: JwtAuthService) {

  }

  ngOnInit(): void {

  }

}
