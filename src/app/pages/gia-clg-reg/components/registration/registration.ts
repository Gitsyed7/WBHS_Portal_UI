import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CollegeRegistrationService } from '../../../../services/college-registration.service';
import { Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-registration',
  imports: [
    FormsModule,
    CommonModule,
    BsDatepickerModule
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
})

export class Registration {

//#region Variables

//PAGE STATUS

  currentStatus:string='HRMS';
  registrationCompleted = false;


  //TEXTBOX VARIABLES

  hrmsID:string='';
  slrNo = '';
  dob='';
  applicationId = '';
  today:string='';
  maxDate: Date = new Date();
  errorMessage:string='';

  get dobDate(): Date | null {
    if (!this.dob) return null;
    const parts = this.dob.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    const d = new Date(this.dob);
    return isNaN(d.getTime()) ? null : d;
  }

  set dobDate(value: Date | null | undefined) {
    if (!value || isNaN(value.getTime())) {
      this.dob = '';
    } else {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      this.dob = `${year}-${month}-${day}`;
    }
  }

  //MODAL VARIABLES


  showMessageModal = false;
  modalMessage = '';
  modalType = 'info';
  modalTitle = '';
  buttonText = 'Continue';

  
//#endregion

constructor(
    private service: CollegeRegistrationService,
    private cdr: ChangeDetectorRef
) {}

ngOnInit(){

 this.today=
 new Date().toISOString().split('T')[0];

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

                if(response.applicationId){
                    
                    this.applicationId = response.applicationId;
                    this.slrNo = response.slrNo;
                    this.dob = response.dob;

                    this.registrationCompleted = true;
                    this.currentStatus = 'DOB';
                    this.cdr.detectChanges();
                    this.openModal(
                        response.message,
                        'success',
                        response.applicationId
                    );
                }
                else{

                    this.registrationCompleted = false;
                    this.currentStatus = 'DOB';
                    this.cdr.detectChanges();
                    this.openModal(
                        response.message,
                        'success'
                    );
                }

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
        'warning');

    break;
                case "2":
                  this.currentStatus = 'HRMS';
    this.hrmsID = '';
    this.cdr.detectChanges();
    this.openModal(
        response.message,
        'info'
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

// Save button Click

saveCollegeRegistration(): void {
if(!this.dob)
{
    this.errorMessage =
        'DOB is mandatory field.';
    return;
}
if (this.dobDate && this.dobDate > this.maxDate) {
    this.errorMessage = 'Date of birth cannot be a future date.';
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
        //this.currentStep = 1;
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

//#region Utility Methods

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

//MAKE COMPLETE HRMS ID

  getCompleteHRMSID(): string {

    return 'G' + this.hrmsID;

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
openPicker(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (typeof input.showPicker === 'function') {
    input.showPicker();
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
@Output()
moveNext = new EventEmitter<any>();

continueEnrollment(): void {

    this.showMessageModal = false;
    if(this.modalType === 'success' && this.applicationId)
    {
        //this.moveNext.emit();
        console.log({
    applicationId: this.applicationId,
    hrmsId: this.hrmsID,
    slrNo: this.slrNo,
    dob: this.dob
});
        this.moveNext.emit({
            applicationId: this.applicationId,
            hrmsId: this.hrmsID,
            slrNo: this.slrNo,
            dob: this.dob
        });
    }
}
//#endregion


}
