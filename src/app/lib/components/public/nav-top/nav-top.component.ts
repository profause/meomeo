import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-top',
  imports: [],
  templateUrl: './nav-top.component.html',
  styleUrl: './nav-top.component.scss'
})
export class NavTopComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
