import { Component, OnInit, ViewChild, ElementRef, importProvidersFrom } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { PsqlService } from '../psql.service';
import { MessageService } from '../message.service';
import { Router } from '@angular/router';
import { JwtAuthService } from '../jwt-auth.service';

//material
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

//forms
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mines',
  standalone: true,
  imports: [NavbarComponent, FormsModule, ReactiveFormsModule, MatSelectModule, MatPaginatorModule, MatSortModule, CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './mines.component.html',
  styleUrl: './mines.component.css'
})
export class MinesComponent implements OnInit {

  constructor(public auth: JwtAuthService, public router: Router, private psqlService: PsqlService, private fb: FormBuilder, private messageService: MessageService) {
    this.myForm = this.fb.group({
      lvl: null,
      type: null,
      x: null,
      y: null,
      enhanced: '0'
    });
  }


  myForm: FormGroup;
  levels = ['All', 44, 46, 48, 50];
  levelsSelect = ['44', '46', '48', '50'];
  enhancements = ['0', '50', '100', '150', '200'];
  tileTypes = ['Gold', 'Iron', 'Oil', 'Copper', 'Uranium'];
  coordCheckResult: {}
  isAdmin: Boolean;
  user: {};

  @ViewChild('xRef') nameElementRef: ElementRef;
  @ViewChild('yRef') nameElementRefy: ElementRef;
  @ViewChild('nameRef2') nameElementRef2: MatSelect;
  @ViewChild('nameRef3') nameElementRef3: MatSelect;



  ngOnInit(): void {

  }
  onKeydown(event) {
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
              this.ngOnInit();
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




  deleteMine(id) {
    this.psqlService.deleteCoord("mines", id).subscribe(() => {
      this.ngOnInit();
    })

  }

  updateMine(id, enhancement) {
    this.psqlService.updateCoord("mines", id, enhancement).subscribe(() => {
      this.ngOnInit();
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

  validCoords(data) {
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

}
