import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  showPassword: boolean = false;
  strengthText: string = '';
  strengthClass: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

login() {
  this.authService.login(this.email, this.password)
    .subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Invalid credentials');
        console.error(err);
      }
    });
}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength(): void {
    const value = this.password || '';

    if (value.length < 4) {
      this.strengthText = 'Weak';
      this.strengthClass = 'weak';
    } else if (value.length < 8) {
      this.strengthText = 'Medium';
      this.strengthClass = 'medium';
    } else {
      this.strengthText = 'Strong';
      this.strengthClass = 'strong';
    }
  }
}
