import { Component, OnInit, ViewChild, ElementRef, importProvidersFrom, AfterViewInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { PsqlService } from '../psql.service';
import { MessageService } from '../message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtAuthService } from '../jwt-auth.service';
import { User } from '../_models/user';
import { Filter } from '../_models/filter';
import { AddMinesFormComponent } from "../add-mines-form/add-mines-form.component";
import { FilterMinesAreaComponent } from "../filter-mines-area/filter-mines-area.component";

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
  selector: 'app-mines',
  standalone: true,
  imports: [NavbarComponent, AddMinesFormComponent, FormsModule, ReactiveFormsModule, MatIconModule, MatTableModule, MatButtonModule, MatRadioModule, MatSelectModule, MatPaginatorModule, MatSortModule, CommonModule, MatFormFieldModule, MatInputModule, AddMinesFormComponent, FilterMinesAreaComponent],
  templateUrl: './mines.component.html',
  styleUrl: './mines.component.css',
})
export class MinesComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute, public auth: JwtAuthService, public router: Router, private psqlService: PsqlService, private fb: FormBuilder, private messageService: MessageService) {
    this.myForm = this.fb.group({
      lvl: null,
      type: null,
      x: null,
      y: null,
      enhanced: '0'
    });

    this.rutileForm = this.fb.group({
      x: null,
      y: null
    });

    this.zoneForm = this.fb.group({
      z: null
    });
    this.myForm.controls['enhanced'].setValue('0');
  }


  myForm: FormGroup;
  rutileForm: FormGroup;
  zoneForm: FormGroup;

  public displayedColumns = ['lvl', 'type', 'x', 'y', 'enhanced', 'delete'];
  public dataSource = new MatTableDataSource<any>();
  levels = ['All', 44, 46, 48, 50];
  levelsSelect = ['44', '46', '48', '50'];
  enhancements = ['0', '50', '100', '150', '200'];
  tileTypes = ['Gold', 'Iron', 'Oil', 'Copper', 'Uranium'];
  coordCheckResult!: {}
  isAdmin!: Boolean;
  user!: User;
  lvlvalue!: number;
  enhanced!: number;
  typevalue!: string;
  temp = '';
  zones = [
    { z: 1, x: 0, y: 401 },
    { z: 2, x: 201, y: 401 },
    { z: 3, x: 401, y: 401 },
    { z: 4, x: 0, y: 201 },
    { z: 5, x: 201, y: 201 },
    { z: 6, x: 401, y: 201 },
    { z: 7, x: 0, y: 0 },
    { z: 8, x: 201, y: 0 },
    { z: 9, x: 401, y: 0 }
  ]


  @ViewChild('xRef') nameElementRef!: ElementRef;
  @ViewChild('yRef') nameElementRefy!: ElementRef;
  @ViewChild('nameRef2') nameElementRef2!: MatSelect;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  updateTable() {
    this.psqlService.getCoords("mines", this.user)
      .subscribe(mine => {
        this.dataSource.data = mine;
        this.dataSource.paginator = this.paginator; // Set the paginator here
        this.dataSource.sort = this.sort;
      });
  }

  ngOnInit(): void {
    // Get the resolved data using ActivatedRoute
    const resolvedData = this.route.snapshot.data['mineData'];

    if (resolvedData) {
      this.dataSource.data = resolvedData;
      //this.dataSource.paginator = this.paginator; // Set the paginator here
      //this.dataSource.sort = this.sort;
    }
    this.messageService.hideLoading();

    this.auth.currentUser.subscribe(data => {
      if (data && data.user) {
        this.user = data;
        this.isAdmin = data.user === 'admin';
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  ngAfterViewInit(): void {
    // Set paginator and sort after the view has initialized
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onKeydown(event: any) {
    if (event.key === "ArrowRight") {
      this.nameElementRefy.nativeElement.focus();
    }
  }

  addMine() {
    const formValue = this.myForm.value;

    if (this.validCoords(formValue)) {
      const position = formValue.x + ',' + formValue.y;

      // Check existence in the database instead of in-memory data
      this.psqlService.checkIfCoordExists("mines", position, this.user).subscribe({
        next: (existsResponse) => {
          if (existsResponse.exists) {
            // Mine already exists, show error message
            this.messageService.showError('That tile already exists. Add another.', 'Error');
            this.myForm.reset();
            this.myForm.controls['enhanced'].setValue('0');
            this.nameElementRef.nativeElement.focus();
          } else {
            // Mine does not exist, proceed with adding it
            this.psqlService.addCoord("mines", formValue, this.user).subscribe(() => {
              //this.ngOnInit();
              this.updateTable();
              this.messageService.showSuccess('Added. Thank you!!', 'Notification');
              this.myForm.reset();
              this.myForm.controls['enhanced'].setValue('0');
              this.nameElementRef.nativeElement.focus();
            });
          }
        },
        error: (err) => {
          console.error('Error checking if coordinate exists:', err);
          this.messageService.showError('An error occurred while checking the tile. Please try again.', 'Error');
        }
      });
    }
  }

  deleteMine(id: number): void {
    this.psqlService.deleteCoord("mines", id).subscribe(() => {
      //this.ngOnInit();
      this.updateTable();
    })
  }

  updateMine(id: number, enhancement: number) {
    this.psqlService.updateCoord("mines", id, enhancement).subscribe(() => {
      //this.ngOnInit();
      this.updateTable();
    })
  }

  validLevel() {
    const lvl = this.myForm.value.lvl;
    const acceptLvl = [44, 46, 48, 50];

    if (lvl !== null && acceptLvl.indexOf(Number(lvl)) === -1) {
      this.messageService.showError('Only levels 44, 46, 48 and 50 are accepted', 'Error');
      this.myForm.reset();
    }
  }

  validCoords(data: any) {
    if (data.x <= 600 && data.x >= 1 && data.y >= 1 && data.y <= 600) {
      return true;
    } else {
      this.messageService.showError('Coords must fall between 1 and 600', 'Error');
      return false;
    }
  }

  signOut() {
    this.router.navigateByUrl('/login');
    this.auth.logout;
  }

  coordCheck() {
    const formValue = this.myForm.value;
    if (this.validCoords(formValue)) {
      const position = formValue.x + ',' + formValue.y
      this.psqlService.coordCheck(position).subscribe(data => {
        if (data.length > 0) {
          this.messageService.showError('Mine already exists', 'Error');
          this.myForm.reset();
          this.nameElementRef.nativeElement.focus();
        }
        else {
          this.messageService.showSuccess('Does not exist yet, please continue adding', 'Notification')
          this.myForm.controls['enhanced'].setValue('0');
          this.nameElementRef2.focus()
        }
      })
    }
  }

  applyRadioFilter(filterValue: string | number): void {
    this.lvlvalue = Number(filterValue);
    this.dataSource.filterPredicate = (data, filter: string) => {
      return data.lvl == filter;
    };
    if (filterValue === 'All') {
      filterValue = '';
    }
    this.dataSource.filter = filterValue.toString().trim().toLowerCase();
  }

  applyRadioFilter2(filterValue: string) {
    this.dataSource.filterPredicate = (data, filter: string) => {
      return data.type == filter && data.lvl == this.lvlvalue;
    };
    //if (filterValue === 'All') {
    //filterValue = '';
    //}
    this.dataSource.filter = filterValue.toString();
  }

  rutileFilter(formValue: any) {

    this.dataSource.filterPredicate = (data, filterString: string) => {
      const filter: Filter = JSON.parse(filterString); // Ensure you provide a valid JSON string

      // Check if the filter values are present
      if (filter.x === undefined || filter.y === undefined) {
        return true; // Allow all items if filter values are not defined
      }

      const xValue = Number(data.x);
      const yValue = Number(data.y);

      // Implement filtering logic: check if x and y are strictly between 200 and 299
      const isXInRange = xValue >= Number(filter.x) && xValue < Number(filter.x) + 100;
      const isYInRange = yValue >= Number(filter.y) && yValue < Number(filter.y) + 100;

      // Return true only if both conditions are met
      return isXInRange && isYInRange;
    };

    // Set the filter for the dataSource
    this.dataSource.filter = JSON.stringify(formValue); // Ensure formValue is of type Filter
  }



  zoneFilter(formValue: any) {  //    { z: 4, x: 0, y: 201 }

    this.dataSource.filterPredicate = (data, filterString: string) => {
      const filter: Filter = JSON.parse(filterString);

      const zone = this.zones.find(({ z }) => z === Number(filter['z']));
      return Number(data.x) > Number(zone!['x']) && Number(data.x) < Number(zone!['x']) + 200 && Number(data.y) > Number(zone!['y'])
        && Number(data.y) < Number(zone!['y']) + 200;
    };
    if (formValue.z! >= 0 && formValue.z! <= 9) {
      this.dataSource.filter = JSON.stringify(formValue);;
    }
    else {
      this.messageService.showError('Please enter a number 0-9', 'Error')
    }
  }


}
