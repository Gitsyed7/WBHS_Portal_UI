import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiValidationService } from '../../../../shared/Services/ui-validation.service';

@Component({
  selector: 'app-office-information',
  imports: [FormsModule],
  templateUrl: './office-information.html',
  styleUrl: './office-information.scss',
})
export class OfficeInformation {
  uiValidation = inject(UiValidationService);

  collegeDistrict = '';
  selectedCollege = '';
  subDivision = '';
  block = '';
  designation = '';
  dateOfEntry = '';
  collegeAddress = '';
  selectedRopa = '01';
  payBand = '';
  gradePay = '';
  bandPay = '';
  payLevel = '';
  basicSalary = '';

  validateAndSave(): boolean {
    console.log('Validating Office Information form...');

    this.uiValidation.fieldErrors = {};

    if (!this.collegeDistrict) {
      return this.uiValidation.validationError(
        'collegeDistrict',
        'College District selection is mandatory.',
        'clg_dist_ddlist'
      );
    }

    if (!this.selectedCollege) {
      return this.uiValidation.validationError(
        'selectedCollege',
        'Name of College is required.',
        'clg_list_ddlist'
      );
    }

    if (!this.subDivision) {
      return this.uiValidation.validationError(
        'subDivision',
        'Sub-Division selection is mandatory.',
        'subdiv_ddlist'
      );
    }

    if (!this.block) {
      return this.uiValidation.validationError(
        'block',
        'Block selection is mandatory.',
        'block_ddlist'
      );
    }

    if (!this.designation) {
      return this.uiValidation.validationError(
        'designation',
        'Designation selection is mandatory.',
        'desig_ddlist'
      );
    }

    if (!this.dateOfEntry) {
      return this.uiValidation.validationError(
        'dateOfEntry',
        'Date of Entry Into College Service is required.',
        'txt_serv_dt'
      );
    }

    if (!this.collegeAddress.trim()) {
      return this.uiValidation.validationError(
        'collegeAddress',
        'Full Address (College) is a mandatory field.',
        'txt_clg_addr'
      );
    }

    if (!this.selectedRopa) {
      return this.uiValidation.validationError(
        'selectedRopa',
        'Revision of Pay and Allowance selection is mandatory.',
        'id_ropa_2009'
      );
    }

    if (this.selectedRopa === '01') {
      if (!this.payBand) {
        return this.uiValidation.validationError(
          'payBand',
          'Pay Band selection is mandatory.',
          'pay_band_ddlist'
        );
      }

      if (!this.gradePay) {
        return this.uiValidation.validationError(
          'gradePay',
          'Grade Pay selection is mandatory.',
          'grade_ddlist'
        );
      }

      if (!this.bandPay.trim()) {
        return this.uiValidation.validationError(
          'bandPay',
          'Band Pay is required.',
          'txt_band'
        );
      }
    } else if (this.selectedRopa === '02') {
      if (!this.payLevel) {
        return this.uiValidation.validationError(
          'payLevel',
          'Pay Level selection is mandatory.',
          'ddl_pay_level'
        );
      }

      if (!this.basicSalary) {
        return this.uiValidation.validationError(
          'basicSalary',
          'Basic Salary selection is mandatory.',
          'ddl_basic_sal'
        );
      }
    }

    console.log('Office Information validated successfully!');

    return true;
  }
}
