import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
 employeeStats = [
  { title: 'Enrolled Employee', value: 223884 },
  { title: 'Beneficiary', value: 765252 },
  { title: 'Applied Claims', value: 145690 },
  { title: 'Settled Claims', value: 144280 }
];
}

