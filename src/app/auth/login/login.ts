import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email: string = '';
  password: string = '';
  error: string = '';
  loading = false;
  showPassword = false;

  constructor(private router: Router) {}

  login() {
      if (!this.email || !this.password) {
        this.error = 'Please enter credentials';
        return;
      }

      this.loading = true;

      setTimeout(() => {
      localStorage.setItem('lyf_logged', 'true');
      this.router.navigate(['/dashboard']);
    },900);
  }
}
