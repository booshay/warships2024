import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordValidator } from '../shared/password.validator';
import { JwtAuthService } from '../jwt-auth.service';
import { MessageService } from '../message.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private fb: FormBuilder,
    public auth: JwtAuthService,
    public messageService: MessageService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: '',
        subscribe: false,
        email: '' // Ensure 'email' field is defined in the form group
      },
      { validator: PasswordValidator }
    );

    const subscribeControl = this.registrationForm.get('subscribe');
    const emailControl = this.registrationForm.get('email');

    if (subscribeControl && emailControl) {
      subscribeControl.valueChanges.subscribe((checkedValue) => {
        if (checkedValue) {
          emailControl.setValidators(Validators.required);
        } else {
          emailControl.clearValidators();
        }
        emailControl.updateValueAndValidity();
      });
    }
  }
  /* constructor(private fb: FormBuilder, public auth: JwtAuthService, public messageService: MessageService, private router: Router) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: '',
      subscribe: false
    },
      { validator: PasswordValidator });
    this.registrationForm.get('subscribe').valueChanges
      .subscribe(checkedValue => {
        const email = this.registrationForm.get('email');
        if (checkedValue) {
          email.setValidators(Validators.required);
        } else {
          email.clearValidators();
        }
        email.updateValueAndValidity();
      });
  }
 */
  registrationForm: FormGroup;


  register() {
    const formValue = this.registrationForm.value;
    this.auth.register(formValue.username, formValue.password)
      .subscribe(user => {
        //
      },
        (error) => {
          this.messageService.showError(JSON.stringify(error.error), 'Error');
        }
      )
  }

  cancel(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/login');
  }
}
