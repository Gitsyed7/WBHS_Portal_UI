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
}