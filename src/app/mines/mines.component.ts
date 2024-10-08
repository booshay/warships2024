import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { PsqlService } from '../psql.service';

@Component({
  selector: 'app-mines',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './mines.component.html',
  styleUrl: './mines.component.css'
})
export class MinesComponent implements OnInit {

  constructor(private psqlService: PsqlService) { }

  ngOnInit(): void {
    this.psqlService.getCoords('mines', 'admin')
      .subscribe(data => {
        console.log(data)
      })
  }
}
