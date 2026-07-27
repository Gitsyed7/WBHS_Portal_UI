import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CollegeRegistrationService }
from '../../services/college-registration.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'GiaClgReg',
  imports: [
    Navbar,
    FormsModule,
    CommonModule
  ],
  templateUrl: './GiaClgReg.html',
  styleUrl: './GiaClgReg.scss',
})

export class GiaClgReg {

  //PAGE STATUS
  currentStatus:string='HRMS';
  registrationCompleted = false;
  //TEXTBOX VARIABLES
  hrmsID:string='';
  errorMessage:string='';
  dob:string='';
  today:string='';
  showMessageModal = false;
  applicationId = '';
  modalMessage = '';
  modalType = 'info';
  modalTitle = '';
  buttonText = 'Continue';

  //Tracker Variables

  steps = [
  { name: 'Registration', icon: 'bi-person-badge' },
  { name: 'Personal Information', icon: 'bi-person-vcard' },
  { name: 'Office Information', icon: 'bi-building' },
  { name: 'Beneficiary Addition', icon: 'bi-people-fill' },
  { name: 'Administrative Information', icon: 'bi-clipboard-check' }
];

currentStep = 0;

constructor(
    private service: CollegeRegistrationService,
    private cdr: ChangeDetectorRef
) {}

  //HRMS OK button actions

  onHRMSChange():void{


//ONLY NUMBERS

this.hrmsID=
this.hrmsID.replace(/\D/g,'');


//MAXIMUM 10 DIGITS

this.hrmsID=
this.hrmsID.substring(0,10);
}
  //VALIDATE HRMS ID

  validateHRMS():boolean{

    const pattern=/\d{10}$/;
    return pattern.test(this.hrmsID);

  }
//Validator works until lenght reaches 10



//MAKE COMPLETE HRMS ID

  getCompleteHRMSID(): string {

    return 'G' + this.hrmsID;

  }

  //OK BUTTON

  checkHRMS(): void {

    this.applicationId = '';
    this.errorMessage='';

    if(!this.validateHRMS()){
        this.errorMessage =
        'Please enter 10 digit of HRMS ID.';
        return;
    }

    let completeHRMSID =
        this.getCompleteHRMSID();

    this.service
        .checkHRMS(completeHRMSID)
        .subscribe(response=>{

            console.log(response);
            switch(response.status)
            {
                case null:
                    this.currentStatus='DOB';
                    this.cdr.detectChanges();
                    //alert(response.message);
                    this.openModal(
        response.message,
        'success'
    );
                    break;   
                case "0":
                    this.currentStatus='DOB';
                    this.cdr.detectChanges();
                    //alert(response.message);
                    this.openModal(
        response.message,
        'success'
    );
                    break;

                case "3":
                    this.currentStatus = 'DOB';
                    this.cdr.detectChanges();
                    //alert(response.message);
                    this.openModal(
        response.message,
        'warning');
                    break;

                case "1":
                  this.currentStatus = 'HRMS';
    this.hrmsID = '';
    this.cdr.detectChanges();
    this.openModal(
        response.message,
        'warning'
    );

    break;
                case "2":
                  this.currentStatus = 'HRMS';
    this.hrmsID = '';
    this.cdr.detectChanges();
    this.openModal(
        response.message,
        'warning'
    );

    break;
                case "4":
                case "5":
                    this.currentStatus = 'HRMS';
    this.hrmsID = '';
this.cdr.detectChanges();
    this.openModal(
        response.message,
        'error'
    );

    break;
            }
        });
}

onlyNumbers(event: any): void {

    event.target.value =
        event.target.value.replace(/[^0-9]/g, '');

    this.hrmsID = event.target.value;

    if (this.hrmsID.length < 10) {

        this.errorMessage =
            'Please enter 10 digit of HRMS ID.';

    }
    else {

        this.errorMessage = '';

    }
}
resetForm(): void {

  this.hrmsID = '';
  this.dob = '';
  this.errorMessage = '';

  this.currentStatus = 'HRMS';
  

}

openModal(
    message: string,
    type: string = 'info',
    appId:string=''
): void {

    this.applicationId = appId;
    this.modalMessage = message;
    this.modalType = type;

    switch(type)
{
    case 'success':

        this.modalTitle = 'Success';
        this.buttonText = 'Continue →';
        break;

    case 'warning':

        this.modalTitle = 'Warning';
        this.buttonText = 'OK';
        break;

    case 'error':

        this.modalTitle = 'Error';
        this.buttonText = 'Close';
        break;

    default:

        this.modalTitle = 'Information';
        this.buttonText = 'OK';
        break;
}

    this.showMessageModal = true;
}


closeModal(): void {

    this.showMessageModal = false;

    this.modalType = 'info';
    this.modalTitle = '';
    this.modalMessage = '';
    this.applicationId = '';

}
saveCollegeRegistration(): void {
if(!this.dob)
{
    this.errorMessage =
        'DOB is mandatory field.';
    return;
}
  const request = {
    hrmsId: this.getCompleteHRMSID(),
    dob: this.dob
  };

  console.log(request);

  this.service
      .saveCollegeRegistration(request)
      .subscribe({

        next: (response) => {

          console.log(response);

          if(response.isSuccess){

            this.applicationId =
        response.applicationId;
        this.registrationCompleted = true;
        this.currentStep = 1;
    this.openModal(
        response.message,
        'success',
        response.applicationId
    );
            this.cdr.detectChanges();
          }
        },

        error: (err) => {

          console.error(err);

        }
      });
}

ngOnInit(){

 this.today=
 new Date().toISOString().split('T')[0];

}
openPicker(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (typeof input.showPicker === 'function') {
    input.showPicker();
  }

}
continueEnrollment(): void {
    this.showMessageModal = false;
}
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
}
