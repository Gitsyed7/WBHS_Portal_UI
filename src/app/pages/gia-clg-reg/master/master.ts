import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/header/header';
import { Footer } from '../../../shared/footer/footer';
import { Navbar } from '../../../shared/navbar/navbar';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CollegeRegistrationService } from '../../../services/college-registration.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components of master
import { Registration } from '../components/registration/registration';
import { PersonalInformation } from '../components/personal-information/personal-information';
import { OfficeInformation } from '../components/office-information/office-information';
import { Beneficiary } from '../components/beneficiary/beneficiary';
import { Administrative } from '../components/administrative/administrative';

@Component({
  selector: 'app-master',
  imports: [Navbar,
    Registration,
    PersonalInformation,
    OfficeInformation,
    Beneficiary,
    Administrative,
    FormsModule,
    CommonModule],
  templateUrl: './master.html',
  styleUrl: './master.scss',
})

export class Master {

//#region Variable declaration

slrNo = '';
dob='';
applicationId = '';
hrmsId ='';

//Tracker Variables

  steps = [
  { name: 'Registration',shortName: 'Registration', icon: 'bi-person-badge' },
  { name: 'Personal Information',shortName: 'Personal', icon: 'bi-person-vcard' },
  { name: 'Office Information',shortName: 'Office', icon: 'bi-building' },
  { name: 'Beneficiary Addition',shortName: 'Beneficiary', icon: 'bi-people-fill' },
  { name: 'Administrative Information',shortName: 'Administration', icon: 'bi-clipboard-check' }
];

currentStep = 0;


//#endregion

getStepStatus(index: number): string {

  if (index < this.currentStep) {
    return 'completed';
  }

  if (index === this.currentStep) {
    return 'active';
  }

  if (index === this.currentStep + 1) {
    return 'next';
  }

  return 'upcoming';

}
goToPersonal(data: any): void {

    console.log(data);
    
    this.applicationId = data.applicationId;
    this.hrmsId = data.hrmsId;
    this.slrNo = data.slrNo;
    this.dob = data.dob;

    this.currentStep = 1;

}

}

