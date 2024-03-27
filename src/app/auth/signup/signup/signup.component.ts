import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  activeForm: 'login' | 'signup' = 'login';
  signupForm: FormGroup;
  showPsswd: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  showForm(form: 'login' | 'signup'): void {
    this.activeForm = form;
  }

  signup() {
    if (this.signupForm.valid) {
      const userData = this.signupForm.value;
      this.authService.signup(userData).subscribe(
        () => {
          this.router.navigate(['/home/home'])
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  changePsswdVisibility() {
    this.showPsswd = !this.showPsswd;
  }


}
