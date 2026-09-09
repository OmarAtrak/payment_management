import {FormGroup} from "@angular/forms";
import {format} from "date-fns";

// Capitalize the first letter of string
export function capitalizeFirstLetter(str: string): string {
  if (str != undefined && str != '') {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return '';
}

// Check if two Variables are equal
export function MustMatch(password:string, confirmPassword:string) {

  return (formGroup:FormGroup) => {
    const passwordControl = formGroup.controls[password];
    const confirmPasswordControl = formGroup.controls[confirmPassword];

    if(confirmPasswordControl.errors && confirmPasswordControl.errors.mustMatch)
      return ;

    if(passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({mustMatch:true});
    }
    else {
      confirmPasswordControl.setErrors({mustMatch:null});
    }

  }
}

// convert time from milliseconds to time(hh:mm:ss)
export function millisecondsToTime(duration: number): string {
  const hours = Math.floor(duration / (60 * 60 * 1000));
  const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((duration % (60 * 1000)) / 1000);

  const hoursDisplay = hours > 0 ? hours + "h" : "";
  const minutesDisplay = minutes > 0 ? minutes + "m" : "";
  const secondsDisplay = seconds > 0 ? seconds + "s" : "";

  return `${hoursDisplay} ${minutesDisplay} ${secondsDisplay}`;
}

// fomated  date dd/mm/yyyy
export function frenchDate(date :string):string{
  if (date) {
    return date.substring(8,10)+'/'+date.substring(5,7)+'/'+date.substring(0,4);
  }
  else
    return date;

}

// space between phone number
export function phoneNumberFormat(phoneNumberData: string) {
   let phoneNumber = '';
   if(phoneNumberData) {
      phoneNumber = phoneNumberData.substring(0, 2) + ' ' +
                    phoneNumberData.substring(2, 4) + ' ' +
                    phoneNumberData.substring(4, 6) + ' ' +
                    phoneNumberData.substring(6, 8) + ' ' +
                    phoneNumberData.substring(8, 10);
   }
   return phoneNumber;
}

export function addSpaceBetweenNumber(number:string) {
  if (number) {
    number += '';
    const x = number.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 + x2;
  }
  return number;
}

export function convertDecimalToTimeHHMM(decimal: number): string {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal % 1) * 100);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function indexOfObjectInList(object: any, list: Array<any>): number {
  let indexOfObject: number = -1;

  list.forEach((el: any, index: number) => {
    if (el.id == object.id) {
      indexOfObject = index;
    }
  });

  return indexOfObject;
}

export function convertTo12Hour(time24: string): string {
  const [hourStr, minute] = time24.split(':');
  let hour = parseInt(hourStr, 10);

  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }

  const hour12 = hour.toString().padStart(2, '0');
  return `${hour12}:${minute}`;
}
