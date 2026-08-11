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
  imports: [
    Navbar,
    Registration,
    PersonalInformation,
    OfficeInformation,
    Beneficiary,
    Administrative,
    FormsModule,
    CommonModule
  ],
  templateUrl: './master.html',
  styleUrl: './master.scss',
})
export class Master {

  //#region Variable declaration

  slrNo = '';
  dob = '';
  applicationId = '';
  hrmsId = '';

  // Personal Information workflow state
  personalSaved = false;

  @ViewChild('personalComp') personalComp?: PersonalInformation;
  @ViewChild('officeComp') officeComp?: OfficeInformation;
  @ViewChild('beneficiaryComp') beneficiaryComp?: Beneficiary;
  @ViewChild('adminComp') adminComp?: Administrative;

  // Tracker Variables

  steps = [
    {
      name: 'Registration',
      shortName: 'Registration',
      icon: 'bi-person-badge'
    },
    {
      name: 'Personal Information',
      shortName: 'Personal',
      icon: 'bi-person-vcard'
    },
    {
      name: 'Office Information',
      shortName: 'Office',
      icon: 'bi-building'
    },
    {
      name: 'Beneficiary Addition',
      shortName: 'Beneficiary',
      icon: 'bi-people-fill'
    },
    {
      name: 'Administrative Information',
      shortName: 'Administration',
      icon: 'bi-clipboard-check'
    }
  ];

  currentStep = 0;

  //#endregion


  //#region Tracker

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

  //#endregion


  //#region Registration Navigation

  goToPersonal(data: any): void {

    console.log(data);

    this.applicationId = data.applicationId;
    this.hrmsId = data.hrmsId;
    this.slrNo = data.slrNo;
    this.dob = data.dob;

    // Fresh entry into Personal Information
    this.personalSaved = false;

    this.currentStep = 1;
  }

  //#endregion


  //#region Step Navigation & Validation

  saveAndContinue(): void {

    // ---------------------------------
    // Personal Information
    // ---------------------------------

    if (this.currentStep === 1 && this.personalComp) {

      const isValid =
        typeof this.personalComp.validateAndSave === 'function'
          ? this.personalComp.validateAndSave()
          : true;

      if (!isValid) {

        console.warn(
          'Personal Information validation failed. Staying on current step.'
        );

        return;
      }

      // Validation + API save succeeded.
      // IMPORTANT:
      // Do NOT move to Office Information here.
      this.personalSaved = true;

      console.log(
        'Personal Information validated and saved successfully.'
      );

      return;
    }


    // ---------------------------------
    // Office Information
    // ---------------------------------

    if (this.currentStep === 2 && this.officeComp) {

      const isValid =
        typeof (this.officeComp as any).validateAndSave === 'function'
          ? (this.officeComp as any).validateAndSave()
          : true;

      if (!isValid) {

        console.warn(
          'Office Information validation failed. Staying on current step.'
        );

        return;
      }

      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }

      return;
    }


    // ---------------------------------
    // Beneficiary Information
    // ---------------------------------

    if (this.currentStep === 3 && this.beneficiaryComp) {

      const isValid =
        typeof (this.beneficiaryComp as any).validateAndSave === 'function'
          ? (this.beneficiaryComp as any).validateAndSave()
          : true;

      if (!isValid) {

        console.warn(
          'Beneficiary Information validation failed. Staying on current step.'
        );

        return;
      }

      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }

      return;
    }
  }


  continueToNextStep(): void {

    if (this.currentStep < this.steps.length - 1) {

      this.currentStep++;

      console.log(
        `Moved to step ${this.currentStep}: ${this.steps[this.currentStep].name}`
      );
    }
  }


  previousStep(): void {

    if (this.currentStep > 1) {

      this.currentStep--;

      console.log(
        `Returned to step ${this.currentStep}: ${this.steps[this.currentStep].name}`
      );
    }
  }


  submitApplication(): void {

    let isValid = true;

    if (
      this.adminComp &&
      typeof (this.adminComp as any).validateAndSave === 'function'
    ) {
      isValid = (this.adminComp as any).validateAndSave();
    }

    if (isValid) {

      console.log(
        'Application Submitted Successfully!'
      );

      alert(
        'Application submitted successfully!'
      );
    }
  }

  //#endregion
}