import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../utils/service/authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  activeForm: 'login' | 'signup' = 'login';
  loginForm: FormGroup;
  showPsswd: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private authorizationService: AuthorizationService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  showForm(form: 'login' | 'signup'): void {
    this.activeForm = form;
  }

  login() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      this.authService.login(userData).subscribe(
        () => {
          this.router.navigate(['/home/home']);
          this.authorizationService.getUserRoles();
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
