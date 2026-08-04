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

firstName='';
lastName='';
selectedIdProof='';

private lookupService = inject(LookupService);

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

allowLettersAndSpaces(event: Event): void {

    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^a-zA-Z ]/g, '');

    this.firstName = input.value;
}
allowLettersAndNOSpaces(event: Event): void {

    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^a-zA-Z]/g, '');

    this.lastName = input.value;
}

validateInput(event: Event, pattern: RegExp): void {

    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(pattern, '');

}

//#endregion

}
