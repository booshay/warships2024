import { Component } from '@angular/core';
import { JwtAuthService } from '../jwt-auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, public jwtAuth: JwtAuthService
  ) {
    this.loginForm = this.fb.group({
      username: '',
      password: ''
    });
  }

  user = {
    username: '',
    password: ''
  };

  login() {
    const formValue = this.loginForm.value;
    this.jwtAuth.login(formValue.username, formValue.password)
      .subscribe(user => {
        //
      },
        (error) => {
          //this.messageService.showError(JSON.stringify(error.error.error), 'Error');
          this.loginForm.reset();
        }
      )
  }

}