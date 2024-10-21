import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { MinesComponent } from '../mines/mines.component';
import { User } from '../_models/user';

//material
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

//forms
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MessageService } from '../message.service';
import { PsqlService } from '../psql.service';

@Component({
  selector: 'app-add-mines-form',
  standalone: true,
  imports: [MinesComponent, FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './add-mines-form.component.html',
  styleUrl: './add-mines-form.component.css'
})
export class AddMinesFormComponent {

  constructor(private fb: FormBuilder, private messageService: MessageService, private psqlService: PsqlService, private minesComponent: MinesComponent) {
    this.myForm = this.fb.group({
      lvl: null,
      type: null,
      x: null,
      y: null,
      enhanced: '0'
    });
    this.myForm.controls['enhanced'].setValue('0');
  }

  @Input() user: User | null = null;

  myForm: FormGroup;
  levels = ['All', 44, 46, 48, 50];
  levelsSelect = ['44', '46', '48', '50'];
  enhancements = ['0', '50', '100', '150', '200'];
  tileTypes = ['Gold', 'Iron', 'Oil', 'Copper', 'Uranium'];
  coordCheckResult!: {}
  isAdmin!: Boolean;
  @ViewChild('xRef') nameElementRef!: ElementRef;
  @ViewChild('yRef') nameElementRefy!: ElementRef;
  @ViewChild('nameRef2') nameElementRef2!: MatSelect;

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
              this.minesComponent.updateTable();
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

  validCoords(data: any) {
    if (data.x <= 600 && data.x >= 1 && data.y >= 1 && data.y <= 600) {
      return true;
    } else {
      this.messageService.showError('Coords must fall between 1 and 600', 'Error');
      return false;
    }
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
