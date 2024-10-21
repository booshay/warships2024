import { Component } from '@angular/core';
import { Filter } from '../_models/filter';

//material
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
import { MessageService } from '../message.service';
import { MinesComponent } from '../mines/mines.component';

@Component({
  selector: 'app-filter-mines-area',
  standalone: true,
  imports: [MatRadioModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './filter-mines-area.component.html',
  styleUrl: './filter-mines-area.component.css'
})
export class FilterMinesAreaComponent {

  constructor(private fb: FormBuilder, private messageService: MessageService, private minesComponent: MinesComponent) {
    this.rutileForm = this.fb.group({
      x: null,
      y: null
    });

    this.zoneForm = this.fb.group({
      z: null
    });
  }

  rutileForm: FormGroup;
  zoneForm: FormGroup;
  lvlvalue!: number;
  typevalue!: string;

  applyRadioFilter(filterValue: string | number): void {
    this.lvlvalue = Number(filterValue);
    this.minesComponent.applyRadioFilter(this.lvlvalue)
  }

  applyRadioFilter2(filterValue: string) {
    this.minesComponent.applyRadioFilter2(filterValue);
  }

  rutileFilter() {
    const formValue: Filter = this.rutileForm.value;
    this.minesComponent.rutileFilter(formValue);
  }



  zoneFilter() {  //    { z: 4, x: 0, y: 201 }
    const formValue: Filter = this.zoneForm.value;
    this.minesComponent.zoneFilter(formValue)
  }
}
