import { Component } from '@angular/core';
import { WhatsNew } from './whats-new/whats-new';
import { Circulars } from './circulars/circulars';

@Component({
  selector: 'app-home',
  imports: [WhatsNew,Circulars],
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
PensionerStats = [
  { title: 'Enrolled Pensioner', value: 129596 },
  { title: 'Beneficiary', value: 262015 },
  { title: 'Applied Claims', value: 457890 },
  { title: 'Settled Claims', value: 427863 }
];
}

