import { Component,
  Input,
  OnInit,
  inject } from '@angular/core';
  import { FormsModule } from '@angular/forms';

import { LookupService } from '../../../../services/lookup.service';
import { Gender } from '../../../../models/gender.model';
import { MaritalStatus } from '../../../../models/marital-status.model';
import { District } from '../../../../models/district.model';
import { IfscRequest } from '../../../../models/ifsc-Request.model';
import { IfscResponse } from '../../../../models/ifsc-Response.model';

@Component({
  selector: 'app-personal-information',
  imports: [FormsModule],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.scss',
})

export class PersonalInformation implements OnInit {
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

private lookupService = inject(LookupService);
private readonly emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;


genders: Gender[] = [];
maritalStatuses: MaritalStatus[] = [];
districts: District[] = [];

ifscCode = '';
ifscDetails: IfscResponse | null = null;

ngOnInit(): void {

    console.log('APP ID :', this.applicationId);
    console.log("HRMS ID :", this.hrmsId);
    console.log('SLR NO :', this.slrNo);
    console.log('DOB :', this.dob);

    this.loadGender();
    this.loadMaritalStatus();
    this.loadDistrict();
    

}

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
    console.log('IFSC:', this.ifscCode);

    if (this.ifscCode.length !== 11) {
        this.ifscDetails = null;
        return;
    }

    const request: IfscRequest = {
        IFSC: this.ifscCode.toUpperCase()
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

                console.error('IFSC API Error:', error);

                this.ifscDetails = null;

            }

        });
}

validateInput(event: Event, pattern: RegExp): void {

    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(pattern, '');

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
        this.emailError = 'Please enter a valid email address.'; } 
    else { this.emailError = ''; } }

//#endregion

}
