import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  
})
export class Navbar {
  menuOpen: boolean = false;

enrolOpen: boolean = false;
claimOpen: boolean = false;
hospitalOpen: boolean = false;

toggleHospital(event: MouseEvent): void {
  event.stopPropagation();
  this.hospitalOpen = !this.hospitalOpen;
}
toggleClaim(event: MouseEvent): void {
  event.stopPropagation();
  this.claimOpen = !this.claimOpen;
}
toggleEnrol(event: MouseEvent): void {
  event.stopPropagation();
  this.enrolOpen = !this.enrolOpen;
}
}
