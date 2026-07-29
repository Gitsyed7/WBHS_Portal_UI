import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-personal-information',
  imports: [],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.scss',
})


export class PersonalInformation {
@Input() applicationId = '';
@Input() slrNo = '';
@Input() dob = '';

ngOnInit() {

    console.log('APP ID :', this.applicationId);
    console.log('SLR NO :', this.slrNo);
    console.log('DOB :', this.dob);

}

}
