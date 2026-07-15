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
openMenu:string | null = null;
toggleMenu(menu:string):void{

    this.openMenu=
    this.openMenu===menu
    ? null
    : menu;

}
isMenuOpen(menu:string):boolean{

    return this.openMenu===menu;

}
}
