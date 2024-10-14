import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { PsqlService } from '../psql.service';
import { MessageService } from '../message.service';

//material
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//forms
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-query',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, MatIconModule, MatTableModule, MatButtonModule, MatRadioModule, MatSelectModule, MatPaginatorModule, MatSortModule, CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './query.component.html',
  styleUrl: './query.component.css'
})
export class QueryComponent implements OnInit {

  queryForm!: FormGroup;


  constructor(private router: Router, private fb: FormBuilder, public psqlService: PsqlService, private messageService: MessageService) {

  }

  public dataSource = new MatTableDataSource<any>();

  public displayedColumns = ['lvl', 'type', 'x', 'y', 'enhanced'];
  enhancements = ['0', '50', '100', '150', '200'];
  qty = 0;

  @ViewChild('nameRef') nameElementRef!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngAfterViewInit() {
    if (this.idToken.user == 'admin') {
      console.log('you are admin')
    }
    else {
      this.messageService.showError('only for admins', 'Error')
      this.router.navigate(['/mines']);
    }
    this.dataSource.paginator = this.paginator;
  }
  currentUser = localStorage.getItem("currentUser");
  idToken = this.currentUser ? JSON.parse(this.currentUser) : null;

  //idToken = JSON.parse(localStorage.getItem("currentUser"));


  ngOnInit() {
    this.psqlService.getCoords("mines", this.idToken)
      .subscribe(mine => {
        this.qty = mine.length
        this.dataSource.data = mine;
        this.dataSource.sort = this.sort;
      });

    this.queryForm = this.fb.group({
      query: 'SELECT * FROM (SELECT DISTINCT ON (position) * FROM mines) t ORDER BY RANDOM() LIMIT 30'
    })
  }

  updateMine(id: number, enhancement: number) {
    this.psqlService.updateCoord("mines", id, enhancement).subscribe(() => {
      this.ngOnInit();
    })
  }

  runQuery() {
    const formValue = this.queryForm.value;
    this.psqlService.runQuery(formValue)
      .subscribe(data => {
        this.dataSource.data = data;
        this.qty = data.length
      },
        err => this.messageService.showError(err.error, 'Error'),
        () => console.log('Request complete')

      )
  }

  random() {
    this.psqlService.runQuery({ query: 'SELECT * FROM mines WHERE user_id=1 ORDER BY RANDOM() LIMIT 10' })
      .subscribe(data => {
        this.dataSource.data = data;
        this.qty = data.length
      })
  }

}
