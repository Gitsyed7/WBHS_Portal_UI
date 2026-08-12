
//#region Imports
import { Component,
  Input,
  OnInit,
  inject,
  OnChanges, 
  SimpleChanges } from '@angular/core';
  import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { LookupService } from '../../../../services/lookup.service';
import { Gender } from '../../../../models/gender.model';
import { MaritalStatus } from '../../../../models/marital-status.model';
import { District } from '../../../../models/district.model';
import { IfscRequest } from '../../../../models/ifsc-Request.model';
import { IfscResponse } from '../../../../models/ifsc-Response.model';
import { UiValidationService } from '../../../../shared/Services/ui-validation.service';
import { CollegeRegistrationService } from '../../../../services/college-registration.service';

//#endregion

@Component({
  selector: 'app-personal-information',
  imports: [FormsModule],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.scss',
})

export class PersonalInformation implements OnInit, OnChanges {

//#region Variable Declaration

@Input() hrmsId ='';
@Input() applicationId = '';
@Input() slrNo = '';
@Input() dob = '';
@Input() personalInformationData: any = null;

selectedGender = '';
selectedMaritalStatus = '';
selectedDistrict = '';
isGenderLoading = true;

retirementAge = '';
firstName = '';
lastName = '';
permanentAddress = '';
mobileNo = '';
mobileError = '';
email ='';
emailError = '';
residencePhoneNo = '';
selectedIdProof='';
aadhaarError = '';

genders: Gender[] = [];
maritalStatuses: MaritalStatus[] = [];
districts: District[] = [];

private readonly emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
public uiValidation = inject(UiValidationService);
private collegeRegistrationService = inject(CollegeRegistrationService);

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

//#endregion

//#region Identity Proof Segmented Input Logic

idProofNo = '';

panPart1 = '';
panPart2 = '';
panPart3 = '';

onIdProofTypeChange(): void {

   this.uiValidation.clearFieldError('idProofNo');

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

    // Live Aadhaar validation
  if (this.aadhaarNo.length > 0 && this.aadhaarNo.length < 12) {
    this.aadhaarError = 'Aadhaar Number must be 12 digits.';
  } else {
    this.aadhaarError = '';
  }

  // Clear validate-time error when user starts correcting
  this.uiValidation.clearFieldError('aadhaarNo');

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

    // Live Aadhaar validation
  if (this.aadhaarNo.length > 0 && this.aadhaarNo.length < 12) {
    this.aadhaarError = 'Aadhaar Number must be 12 digits.';
  } else {
    this.aadhaarError = '';
  }

  this.uiValidation.clearFieldError('aadhaarNo');
  }

  updateCombinedAadhaar(): void {
    this.aadhaarNo = this.aadhaarPart1 + this.aadhaarPart2 + this.aadhaarPart3;
  }
  //#endregion

//#region Mobile Number Length Validator

onMobileInput(event: Event): void {
  const input = event.target as HTMLInputElement;

  const value = input.value.replace(/\D/g, '');

  input.value = value;
  this.mobileNo = value;

  if (value.length > 0 && value.length < 10) {
    this.mobileError = 'Mobile Number must be 10 digits.';
  } else {
    this.mobileError = '';
  }
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

//#region Step Validation and Data Saving

validateAndSave(): boolean {

  console.log('Validating Personal Information form...');

  // Clear previous validation state
  this.ifscError = '';
  this.uiValidation.fieldErrors = {};

  // ---------------------------------
  // Retirement Age
  // ---------------------------------

  if (!this.retirementAge) {
    return this.uiValidation.validationError(
      'retirementAge',
      'Retirement Age is a mandatory field.',
      'ret_yr_60'
    );
  }

  // ---------------------------------
  // First Name
  // ---------------------------------

  if (!this.firstName.trim()) {
    return this.uiValidation.validationError(
      'firstName',
      'First Name is required.',
      'txt_fname'
    );
  }

  // ---------------------------------
  // Last Name
  // ---------------------------------

  if (!this.lastName.trim()) {
    return this.uiValidation.validationError(
      'lastName',
      'Last Name is required.',
      'txt_lname'
    );
  }

  // ---------------------------------
  // Gender
  // ---------------------------------

  if (!this.selectedGender) {
    return this.uiValidation.validationError(
      'selectedGender',
      'Gender selection is mandatory.',
      'sex_ddlist'
    );
  }

  // ---------------------------------
  // Marital Status
  // ---------------------------------

  if (!this.selectedMaritalStatus) {
    return this.uiValidation.validationError(
      'selectedMaritalStatus',
      'Marital Status selection is mandatory.',
      'mrt_ddlist'
    );
  }

  // ---------------------------------
  // Residing District
  // ---------------------------------

  if (!this.selectedDistrict) {
    return this.uiValidation.validationError(
      'selectedDistrict',
      'Residing District selection is mandatory.',
      'dist_ddlist'
    );
  }

  // ---------------------------------
  // Permanent Address
  // ---------------------------------

  if (!this.permanentAddress.trim()) {
    return this.uiValidation.validationError(
      'permanentAddress',
      'Permanent Address is a mandatory field.',
      'txt_addr'
    );
  }

  // ---------------------------------
  // Mobile Number
  // ---------------------------------

  if (!this.mobileNo.trim()) {
  return this.uiValidation.validationError(
    'mobileNo',
    'Mobile Number is mandatory.',
    'txt_mob'
  );
}

if (this.mobileNo.trim().length !== 10) {
  return this.uiValidation.validationError(
    'mobileNo',
    'Mobile Number must be exactly 10 digits.',
    'txt_mob'
  );
}

  // ---------------------------------
  // Email
  // ---------------------------------

  if (!this.email.trim()) {
    return this.uiValidation.validationError(
      'email',
      'Email is required.',
      'txt_email'
    );
  }

  // Existing live email validation
  if (this.emailError) {
    const message = 'Invalid email address.';

    this.uiValidation.showToast(message);
    this.uiValidation.focusControl('txt_email');

    return false;
  }

  // ---------------------------------
  // Identity Proof Type
  // ---------------------------------

  if (!this.selectedIdProof) {
    return this.uiValidation.validationError(
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

      return this.uiValidation.validationError(
        'idProofNo',
        'PAN Card Number is required.',
        'pan_part_1'
      );

    } else if (this.selectedIdProof === '01') {

      return this.uiValidation.validationError(
        'idProofNo',
        'Voter ID Number is required.',
        'voter_single_input'
      );

    } else {

      return this.uiValidation.validationError(
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
    return this.uiValidation.validationError(
      'aadhaarNo',
      'Aadhaar Number is required.',
      'aadhaar_part_1'
    );
  }
  if (this.aadhaarNo.length !== 12) {
  return this.uiValidation.validationError(
    'aadhaarNo',
    'Aadhaar Number must be 12 digits.',
    'aadhaar_part_1'
  );
}

  // ---------------------------------
  // IFSC
  // ---------------------------------

  if (!this.ifscCode.trim()) {

    const message = 'IFSC code is mandatory.';

    this.ifscError = message;
    this.uiValidation.showToast(message);
    this.uiValidation.focusControl('txt_ifsc_cd');

    return false;
  }

  // ---------------------------------
  // IFSC Length
  // ---------------------------------

  if (this.ifscCode.length < 11) {

    const message = 'IFSC code must be 11 characters.';

    this.ifscError = message;
    this.uiValidation.showToast(message);
    this.uiValidation.focusControl('txt_ifsc_cd');

    return false;
  }

  // ---------------------------------
  // IFSC Lookup Result
  // ---------------------------------

  if (!this.ifscDetails?.bank) {

    const message = 'IFSC not found. Contact support.';

    this.ifscError = message;
    this.uiValidation.showToast(message);
    this.uiValidation.focusControl('txt_ifsc_cd');

    return false;
  }

  // ---------------------------------
  // Account Number
  // ---------------------------------

  if (!this.accountNo.trim()) {
    return this.uiValidation.validationError(
      'accountNo',
      'Account Number is required.',
      'txt_ac_no'
    );
  }

  // ---------------------------------
  // Confirm Account Number
  // ---------------------------------

  if (!this.confirmAccountNo.trim()) {
    return this.uiValidation.validationError(
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

    this.uiValidation.showToast(message);
    this.uiValidation.focusControl('txt_ac_no');

    return false;
  }

  // ---------------------------------
  // Account Number Matching
  // ---------------------------------

  if (!this.isConfirmAccountNoMatching) {

    const message = 'Account Numbers do not match.';

    this.uiValidation.showToast(message);
    this.uiValidation.focusControl('txt_cnfm_ac_no');

    return false;
  }

  // ---------------------------------
  // Everything Passed
  // ---------------------------------

  console.log('Personal Information validated successfully!');

  console.log('Personal Information validated successfully!');

const request = {
  slrNo: this.slrNo,
  appId: this.applicationId,
  hrmsId: this.hrmsId,
  firstName: this.firstName,
  lastName: this.lastName,
  dob: this.dob,
  maritalStatus: this.selectedMaritalStatus,
  gender: this.selectedGender,
  districtCode: this.selectedDistrict,
  address: this.permanentAddress,
  identityProofNo: this.idProofNo,
  aadhaarNo: this.aadhaarNo,
  mobileNo: this.mobileNo,
  emailId: this.email,
  residencePhoneNo: this.residencePhoneNo || null,
  retirementAge: this.retirementAge,
  bankIfsc: this.ifscCode,
  bankName: this.ifscDetails?.bank ?? '',
  bankBranchName: this.ifscDetails?.branch ?? '',
  bankMicr: this.ifscDetails?.micR_CODE ?? '',
  bankAccountNo: this.accountNo,

  //identityProofType: this.selectedIdProof
  identityProofType :
  this.selectedIdProof === '01'
    ? 'Voter Card'
    : this.selectedIdProof === '02'
      ? 'PAN Card'
      : ''
};

this.collegeRegistrationService
  .savePersonalInformation(request)
  .subscribe({
    next: (response) => {
      console.log(
        'Personal Information saved successfully:',
        response
      );
    },

    error: (error) => {
      console.error(
        'Personal Information save failed:',
        error
      );
    }
  });

return true;
}

//#endregion

//#region On Changes
ngOnChanges(changes: SimpleChanges): void {

  console.log('🔥 CHILD ngOnChanges:', changes);

  if (
    changes['personalInformationData'] &&
    this.personalInformationData
  ) {

    console.log(
      '🔥 CHILD RECEIVED DATA:',
      this.personalInformationData
    );

    this.populatePersonalInformation();
    this.cdr.detectChanges();
  }
}

//#endregion

populatePersonalInformation(): void {

  const data = this.personalInformationData;
  console.log(
    '🔥 populatePersonalInformation CALLED',
    this.personalInformationData
  );

  this.firstName = data.firstName ?? '';
  this.lastName = data.lastName ?? '';

  this.dob = data.dob ?? '';

  this.selectedMaritalStatus = data.maritalStatus ?? '';
  this.selectedGender = data.gender ?? '';

  this.selectedDistrict = data.districtCode ?? '';

  this.permanentAddress = data.address ?? '';

  this.idProofNo = data.identityProofNo ?? '';
  this.aadhaarNo = data.aadhaarNo ?? '';

  this.mobileNo = data.mobileNo ?? '';
  this.email = data.emailId ?? '';
  this.residencePhoneNo = data.residencePhoneNo ?? '';

  this.retirementAge = data.retirementAge ?? '';

  this.ifscCode = data.bankIfsc ?? '';
  this.accountNo = data.bankAccountNo ?? '';

  // Store IFSC-related information
  this.ifscDetails = {
  bank: data.bankName ?? '',
  branch: data.bankBranchName ?? '',
  micR_CODE: data.bankMicr ?? ''
};

}
}
