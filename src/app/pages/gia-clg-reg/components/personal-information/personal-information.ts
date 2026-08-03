import { Component,
  Input,
  OnInit,
  inject } from '@angular/core';
  import { FormsModule } from '@angular/forms';

import { LookupService } from '../../../../services/lookup.service';
import { Gender } from '../../../../models/gender.model';
import { MaritalStatus } from '../../../../models/marital-status.model';
import { District } from '../../../../models/district.model';

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

private lookupService = inject(LookupService);

genders: Gender[] = [];
maritalStatuses: MaritalStatus[] = [];
districts: District[] = [];

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
//#endregion

}
