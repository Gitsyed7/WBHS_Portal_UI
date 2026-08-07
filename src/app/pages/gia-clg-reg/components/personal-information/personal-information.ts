
//#region Imports
import { Component,
  Input,
  OnInit,
  inject } from '@angular/core';
  import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { LookupService } from '../../../../services/lookup.service';
import { Gender } from '../../../../models/gender.model';
import { MaritalStatus } from '../../../../models/marital-status.model';
import { District } from '../../../../models/district.model';
import { IfscRequest } from '../../../../models/ifsc-Request.model';
import { IfscResponse } from '../../../../models/ifsc-Response.model';
//#endregion

@Component({
  selector: 'app-personal-information',
  imports: [FormsModule],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.scss',
})

export class PersonalInformation implements OnInit {

//#region Variable Declaration

@Input() hrmsId ='';
@Input() applicationId = '';
@Input() slrNo = '';
@Input() dob = '';

selectedGender = '';
selectedMaritalStatus = '';
selectedDistrict = '';
isGenderLoading = true;

selectedIdProof='';
email ='';
emailError = '';

retirementAge = '';
firstName = '';
lastName = '';
permanentAddress = '';
mobileNo = '';
fieldErrors: { [key: string]: string } = {};
toastMessage = '';
showToastMessage = false;

genders: Gender[] = [];
maritalStatuses: MaritalStatus[] = [];
districts: District[] = [];

private readonly emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

ifscCode = '';
ifscError ='';
ifscDetails: IfscResponse | null = null;

//#endregion

//#region Dependency Injection

private lookupService = inject(LookupService);

constructor(private cdr: ChangeDetectorRef) {}

//#endregion

//#region OnInit
ngOnInit(): void {

  this.loadGender();
    this.loadMaritalStatus();
    this.loadDistrict();

}
//#endregion

//#region Utility

loadGender(): void {

    this.lookupService.getGender()
        .subscribe({

            next: (response) => {

                this.genders = response;
                console.log('Gender:', this.genders);
                

            },

            error: (error) => {

                console.error(error);

            }

        });

}
loadMaritalStatus(): void {

    this.lookupService.getMaritalStatus()
        .subscribe({

            next: (response) => {

                this.maritalStatuses = response;
                console.log('Marital:', this.maritalStatuses);
                

            },

            error: (error) => {

                console.error(error);

            }

        });

}
loadDistrict(): void {

    this.lookupService.getDistrict()
        .subscribe({

            next: (response) => {

                this.districts = response;
                console.log('District:', this.districts);

            },

            error: (error) => {

                console.error(error);

            }

        });

}
loadIfscDetails(IfscResponse: string): void {

    const request: IfscRequest = {
        IFSC: IfscResponse
    };

    this.lookupService.getIfscDetails(request)
        .subscribe({

            next: (response) => {

                this.ifscDetails = response;

                console.log(
                    'IFSC Details:',
                    this.ifscDetails
                );

            },

            error: (error) => {

                console.error(error);

            }

        });
}

onIfscInput(): void {

    this.ifscCode = this.ifscCode
        .toUpperCase();

    //console.log('IFSC:', this.ifscCode);
    this.ifscError = '';
    this.ifscDetails = null;

    const value = this.ifscCode;

  // First 4 characters must be letters
  if (value.length >= 1 && !/^[A-Z]{1,4}$/.test(value.substring(0, Math.min(value.length, 4)))) {
    this.ifscError = 'First 4 characters of IFSC must be letters.';
    return;
  }

  // 5th character must be a digit
  if (value.length >= 5 && !/^[A-Z]{4}[0-9]$/.test(value.substring(0, 5))) {
    this.ifscError = 'The 5th character of IFSC must be a number.';
    return;
  }

  // Characters 6–11 must be digits
  if (value.length >= 6 && !/^[A-Z]{4}[0-9][0-9]{0,6}$/.test(value)) {
    this.ifscError = 'Last 6 characters of IFSC must be numbers.';
    return;
  }


    const request: IfscRequest = {
        IFSC: this.ifscCode
    };
    this.lookupService.getIfscDetails(request)
        .subscribe({

            next: (response) => {

                this.ifscDetails = response;
                this.cdr.detectChanges();
                console.log(
                    'IFSC Details:',
                    this.ifscDetails
                );

            },

            error: (error) => {

                console.error(
                    'IFSC API Error:',
                    error
                );

                this.ifscDetails = null;

            }

        });
}

validateInput(event: Event, pattern: RegExp): void {

    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(pattern, '');

}

private focusControl(controlId: string): void {

  setTimeout(() => {

    const control = document.getElementById(controlId) as HTMLElement | null;

    if (!control) {
      console.log('Control not found:', controlId);
      return;
    }

    console.log('Control found:', control);

    control.focus();

    let parent = control.parentElement;

    while (parent) {

      const style = window.getComputedStyle(parent);

      console.log(
        'Parent:',
        parent.className,
        'overflowY:',
        style.overflowY,
        'scrollHeight:',
        parent.scrollHeight,
        'clientHeight:',
        parent.clientHeight
      );

      if (
        parent.scrollHeight > parent.clientHeight &&
        (style.overflowY === 'auto' || style.overflowY === 'scroll')
      ) {

        parent.scrollTo({
          top: control.offsetTop - 150,
          behavior: 'smooth'
        });

        return;
      }

      parent = parent.parentElement;
    }

    // Fallback to document scrolling
    control.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

  }, 100);
}
showToast(message: string): void {
  this.toastMessage = message;
  this.showToastMessage = true;

  setTimeout(() => {
    this.showToastMessage = false;
  }, 3000);
}
private validationError(
  field: string,
  message: string,
  controlId: string
): boolean {

  this.fieldErrors[field] = message;
  this.showToast(message);
  this.focusControl(controlId);

  return false;
}
clearFieldError(field: string): void {
  if (this.fieldErrors[field]) {
    delete this.fieldErrors[field];
  }
}
//#endregion

//#region Identity Proof Segmented Input Logic

idProofNo = '';

panPart1 = '';
panPart2 = '';
panPart3 = '';

onIdProofTypeChange(): void {
  this.panPart1 = '';
  this.panPart2 = '';
  this.panPart3 = '';
  this.idProofNo = '';
}

onPanPartInput(event: Event, partIndex: number, maxLen: number, nextInputId?: string): void {
  const input = event.target as HTMLInputElement;
  let rawVal = input.value.toUpperCase();

  if (partIndex === 1) {
    rawVal = rawVal.replace(/[^A-Z]/g, '');
    this.panPart1 = rawVal;
  } else if (partIndex === 2) {
    rawVal = rawVal.replace(/[^0-9]/g, '');
    this.panPart2 = rawVal;
  } else if (partIndex === 3) {
    rawVal = rawVal.replace(/[^A-Z]/g, '');
    this.panPart3 = rawVal;
  }

  input.value = rawVal;
  this.updateCombinedIdProof();

  if (rawVal.length === maxLen && nextInputId) {
    const nextEl = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextEl) {
      nextEl.focus();
    }
  }
}

onVoterInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let rawVal = input.value.toUpperCase().replace(/[^A-Z0-9\/-]/g, '');
  input.value = rawVal;
  this.idProofNo = rawVal;
}

onSegmentKeydown(event: KeyboardEvent, currentVal: string, prevInputId?: string): void {
  if (event.key === 'Backspace' && (!currentVal || currentVal.length === 0) && prevInputId) {
    const prevEl = document.getElementById(prevInputId) as HTMLInputElement;
    if (prevEl) {
      prevEl.focus();
    }
  }
}

onSegmentPaste(event: ClipboardEvent): void {
  event.preventDefault();
  const pastedText = event.clipboardData?.getData('text') || '';

  if (this.selectedIdProof === '02') {
    const cleaned = pastedText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    this.panPart1 = cleaned.substring(0, 5).replace(/[^A-Z]/g, '');
    this.panPart2 = cleaned.substring(5, 9).replace(/[^0-9]/g, '');
    this.panPart3 = cleaned.substring(9, 10).replace(/[^A-Z]/g, '');
    this.updateCombinedIdProof();
  } else if (this.selectedIdProof === '01') {
    const cleaned = pastedText.toUpperCase().replace(/[^A-Z0-9\/-]/g, '');
    this.idProofNo = cleaned;
  }
}

updateCombinedIdProof(): void {
  if (this.selectedIdProof === '02') {
    this.idProofNo = (this.panPart1 + this.panPart2 + this.panPart3).toUpperCase();
  }
}
  //#endregion

//#region Aadhaar Segmented Input Logic
  aadhaarNo = '';
  aadhaarPart1 = '';
  aadhaarPart2 = '';
  aadhaarPart3 = '';

  onAadhaarPartInput(event: Event, partIndex: number, maxLen: number, nextInputId?: string): void {
    const input = event.target as HTMLInputElement;
    let rawVal = input.value.replace(/[^0-9]/g, '');

    if (partIndex === 1) {
      this.aadhaarPart1 = rawVal;
    } else if (partIndex === 2) {
      this.aadhaarPart2 = rawVal;
    } else if (partIndex === 3) {
      this.aadhaarPart3 = rawVal;
    }

    input.value = rawVal;
    this.updateCombinedAadhaar();

    if (rawVal.length === maxLen && nextInputId) {
      const nextEl = document.getElementById(nextInputId) as HTMLInputElement;
      if (nextEl) {
        nextEl.focus();
      }
    }
  }

  onAadhaarPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const cleaned = pastedText.replace(/[^0-9]/g, '');

    this.aadhaarPart1 = cleaned.substring(0, 4);
    this.aadhaarPart2 = cleaned.substring(4, 8);
    this.aadhaarPart3 = cleaned.substring(8, 12);

    this.updateCombinedAadhaar();
  }

  updateCombinedAadhaar(): void {
    this.aadhaarNo = this.aadhaarPart1 + this.aadhaarPart2 + this.aadhaarPart3;
  }
  //#endregion

//#region Email validator

onEmailInput(event: Event): void { 
    const input = event.target as HTMLInputElement; // Keep only characters allowed in an email address 
    let value = input.value .replace(/[^a-zA-Z0-9._%+\-@]/g, '') .toLowerCase(); 
    this.email = value; // Keep the textbox synchronized after filtering 
    input.value = value; // Clear error while the user is correcting the value 
    if (!value) { this.emailError = ''; return; } 
    if (!this.emailRegex.test(value)) { 
      this.emailError = 'Please enter a valid email address.'; 
    } else { 
      this.emailError = ''; 
    } 
  }
//#endregion

//#region Account Number Logic & Validation
accountNo = '';
confirmAccountNo = '';
accountNoTouched = false;
confirmAccountNoTouched = false;

onAccountNoInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.accountNo = input.value;
  this.accountNoTouched = true;
}

onConfirmAccountNoInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.confirmAccountNo = input.value;
  this.confirmAccountNoTouched = true;
}

get isAccountNoValid(): boolean {
  return this.accountNo.length >= 9 && this.accountNo.length <= 17;
}

get isConfirmAccountNoMatching(): boolean {
  return this.confirmAccountNo.length > 0 && this.confirmAccountNo === this.accountNo;
}
//#endregion

//#region Step Validation

validateAndSave(): boolean {

  console.log('Validating Personal Information form...');

  // Clear previous validation state
  this.ifscError = '';
  this.fieldErrors = {};

  // ---------------------------------
  // Retirement Age
  // ---------------------------------

  if (!this.retirementAge) {
    return this.validationError(
      'retirementAge',
      'Retirement Age is a mandatory field.',
      'ret_yr_60'
    );
  }

  // ---------------------------------
  // First Name
  // ---------------------------------

  if (!this.firstName.trim()) {
    return this.validationError(
      'firstName',
      'First Name is required.',
      'txt_fname'
    );
  }

  // ---------------------------------
  // Last Name
  // ---------------------------------

  if (!this.lastName.trim()) {
    return this.validationError(
      'lastName',
      'Last Name is required.',
      'txt_lname'
    );
  }

  // ---------------------------------
  // Gender
  // ---------------------------------

  if (!this.selectedGender) {
    return this.validationError(
      'selectedGender',
      'Gender selection is mandatory.',
      'sex_ddlist'
    );
  }

  // ---------------------------------
  // Marital Status
  // ---------------------------------

  if (!this.selectedMaritalStatus) {
    return this.validationError(
      'selectedMaritalStatus',
      'Marital Status selection is mandatory.',
      'mrt_ddlist'
    );
  }

  // ---------------------------------
  // Residing District
  // ---------------------------------

  if (!this.selectedDistrict) {
    return this.validationError(
      'selectedDistrict',
      'Residing District selection is mandatory.',
      'dist_ddlist'
    );
  }

  // ---------------------------------
  // Permanent Address
  // ---------------------------------

  if (!this.permanentAddress.trim()) {
    return this.validationError(
      'permanentAddress',
      'Permanent Address is a mandatory field.',
      'txt_addr'
    );
  }

  // ---------------------------------
  // Mobile Number
  // ---------------------------------

  if (!this.mobileNo.trim()) {
    return this.validationError(
      'mobileNo',
      'Mobile Number is mandatory.',
      'txt_mob'
    );
  }

  // ---------------------------------
  // Email
  // ---------------------------------

  if (!this.email.trim()) {
    return this.validationError(
      'email',
      'Email is required.',
      'txt_email'
    );
  }

  // Existing live email validation
  if (this.emailError) {
    const message = 'Invalid email address.';

    this.showToast(message);
    this.focusControl('txt_email');

    return false;
  }

  // ---------------------------------
  // Identity Proof Type
  // ---------------------------------

  if (!this.selectedIdProof) {
    return this.validationError(
      'selectedIdProof',
      'Identity Proof Type is required.',
      'ddl_id_proof'
    );
  }

  // ---------------------------------
  // Identity Proof Number
  // ---------------------------------

  if (!this.idProofNo.trim()) {

    if (this.selectedIdProof === '02') {

      return this.validationError(
        'idProofNo',
        'PAN Card Number is required.',
        'pan_part_1'
      );

    } else if (this.selectedIdProof === '01') {

      return this.validationError(
        'idProofNo',
        'Voter ID Number is required.',
        'voter_single_input'
      );

    } else {

      return this.validationError(
        'idProofNo',
        'Identity Proof Number is required.',
        'txt_id_prf'
      );
    }
  }

  // ---------------------------------
  // Aadhaar
  // ---------------------------------

  if (!this.aadhaarNo.trim()) {
    return this.validationError(
      'aadhaarNo',
      'Aadhaar Number is required.',
      'aadhaar_part_1'
    );
  }

  // ---------------------------------
  // IFSC
  // ---------------------------------

  if (!this.ifscCode.trim()) {

    const message = 'IFSC code is mandatory.';

    this.ifscError = message;
    this.showToast(message);
    this.focusControl('txt_ifsc');

    return false;
  }

  // ---------------------------------
  // IFSC Length
  // ---------------------------------

  if (this.ifscCode.length < 11) {

    const message = 'IFSC code must be 11 characters.';

    this.ifscError = message;
    this.showToast(message);
    this.focusControl('txt_ifsc');

    return false;
  }

  // ---------------------------------
  // IFSC Lookup Result
  // ---------------------------------

  if (!this.ifscDetails?.bank) {

    const message = 'IFSC not found. Contact support.';

    this.ifscError = message;
    this.showToast(message);
    this.focusControl('txt_ifsc');

    return false;
  }

  // ---------------------------------
  // Account Number
  // ---------------------------------

  if (!this.accountNo.trim()) {
    return this.validationError(
      'accountNo',
      'Account Number is required.',
      'txt_ac_no'
    );
  }

  // ---------------------------------
  // Confirm Account Number
  // ---------------------------------

  if (!this.confirmAccountNo.trim()) {
    return this.validationError(
      'confirmAccountNo',
      'Confirm Account Number is required.',
      'txt_cnfm_ac_no'
    );
  }

  // ---------------------------------
  // Account Number Validation
  // ---------------------------------

  if (!this.isAccountNoValid) {

    const message = 'Invalid Account Number.';

    this.showToast(message);
    this.focusControl('txt_ac_no');

    return false;
  }

  // ---------------------------------
  // Account Number Matching
  // ---------------------------------

  if (!this.isConfirmAccountNoMatching) {

    const message = 'Account Numbers do not match.';

    this.showToast(message);
    this.focusControl('txt_cnfm_ac_no');

    return false;
  }

  // ---------------------------------
  // Everything Passed
  // ---------------------------------

  console.log('Personal Information validated successfully!');

  return true;
}
  /* validateAndSave(): boolean {
    console.log('Validating Personal Information form...');
    
    

    if (this.accountNo && (!this.isAccountNoValid || !this.isConfirmAccountNoMatching)) {
      console.warn('Personal Info validation failed: Account details invalid/mismatched');
      return false;
    }

    console.log('Personal Information validated successfully!');
    return true;
  } */

//#endregion

}
