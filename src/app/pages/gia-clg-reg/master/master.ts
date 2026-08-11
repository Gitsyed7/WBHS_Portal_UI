import { Component, ViewChild } from '@angular/core';
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
personalSaved = false;

@ViewChild('personalComp') personalComp?: PersonalInformation;
@ViewChild('officeComp') officeComp?: OfficeInformation;
@ViewChild('beneficiaryComp') beneficiaryComp?: Beneficiary;
@ViewChild('adminComp') adminComp?: Administrative;

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
continueToNextStep(): void {
  if (this.currentStep < this.steps.length - 1) {
    this.currentStep++;
  }
}
//#region Step Navigation & Validation

saveAndContinue(): void {
  let isValid = true;

  if (this.currentStep === 1 && this.personalComp) {
    isValid = typeof this.personalComp.validateAndSave === 'function' 
      ? this.personalComp.validateAndSave() 
      : true;
  } else if (this.currentStep === 2 && this.officeComp) {
    isValid = typeof (this.officeComp as any).validateAndSave === 'function' 
      ? (this.officeComp as any).validateAndSave() 
      : true;
  } else if (this.currentStep === 3 && this.beneficiaryComp) {
    isValid = typeof (this.beneficiaryComp as any).validateAndSave === 'function' 
      ? (this.beneficiaryComp as any).validateAndSave() 
      : true;
  }

  if (isValid && this.currentStep < this.steps.length - 1) {
    this.currentStep++;
  } else if (!isValid) {
    console.warn(`Step ${this.currentStep} validation failed. Staying on current step.`);
  }
}

previousStep(): void {
  if (this.currentStep > 1) {
    this.currentStep--;
  }
}

submitApplication(): void {
  let isValid = true;

  if (this.adminComp && typeof (this.adminComp as any).validateAndSave === 'function') {
    isValid = (this.adminComp as any).validateAndSave();
  }

  if (isValid) {
    console.log('Application Submitted Successfully!');
    alert('Application submitted successfully!');
  }
}

//#endregion

}

