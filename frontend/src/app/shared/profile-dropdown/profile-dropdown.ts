import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-dropdown.html',
  styleUrls: ['./profile-dropdown.scss']
})
export class ProfileDropdown {

  @Output() close = new EventEmitter<void>();

  userName = 'Sree Anjani Kumar';
  email = 'sreeanjanikumar0709@gmail.com';

  constructor(private router: Router) {}

  goToProfile() {
    this.close.emit();
    // future profile page
  }

  goToSettings() {
    this.close.emit();
    // future settings page
  }

  logout() {
    localStorage.removeItem('lyf_logged');
    this.close.emit();
    this.router.navigate(['/login']);
  }
}
