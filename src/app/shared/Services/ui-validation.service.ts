
import { Injectable,inject } from '@angular/core';



@Injectable({
  providedIn: 'root',
})
export class UiValidationService {

fieldErrors: { [key: string]: string } = {};
toastMessage = '';
showToastMessage = false;



public focusControl(controlId: string): void {

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
public validationError(
  field: string,
  message: string,
  controlId: string
): boolean {

  this.fieldErrors[field] = message;
  this.showToast(message);
  this.focusControl(controlId);

  return false;
}
/* clearFieldError(field: string): void {
  if (this.fieldErrors[field]) {
    delete this.fieldErrors[field];
  }
} */
clearFieldError(field: string): void {
  if (this.fieldErrors[field]) {
    delete this.fieldErrors[field];
  }

  if (Object.keys(this.fieldErrors).length === 0) {
    this.showToastMessage = false;
    this.toastMessage = '';
  }
}
validateInput(event: Event, pattern: RegExp): void {

    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(pattern, '');

}
}