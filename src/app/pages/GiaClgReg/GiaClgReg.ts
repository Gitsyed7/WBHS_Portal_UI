import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../shared/navbar/navbar';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CollegeRegistrationService }
from '../../services/college-registration.service';


@Component({
  selector: 'GiaClgReg',
  imports: [
    Navbar,
    FormsModule
  ],
  templateUrl: './GiaClgReg.html',
  styleUrl: './GiaClgReg.scss',
})

export class GiaClgReg {

  //PAGE STATUS
  currentStatus:string='HRMS';
 
  //TEXTBOX VARIABLES
  hrmsID:string='';
  errorMessage:string='';
  dob:string='';
  today:string='';
constructor(
      private service: CollegeRegistrationService
  )
  {

  }

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

  //OK BUTTON

  checkHRMS(): void {

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
                case "0":
                    this.currentStatus='DOB';
                    break;

                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                    alert(response.message);
                    break;
            }
        });
}
onlyNumbers(event: any) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '');
  this.hrmsID = event.target.value;
}
resetForm(): void {

  this.hrmsID = '';
  this.dob = '';
  this.errorMessage = '';

  this.currentStatus = 'HRMS';

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
}
