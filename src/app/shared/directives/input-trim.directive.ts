import { Directive } from "@angular/core";
import { NgControl, ControlValueAccessor } from "@angular/forms";

@Directive({ selector: '[inputTrim]' })
export class InputTrimDirective {
  constructor(private ngControl: NgControl) {
    trimValueAccessor(ngControl.valueAccessor)
  }
}

function trimValueAccessor(valueAccessor: ControlValueAccessor) {
  const original = valueAccessor.registerOnChange;
console.log('herereh')
  valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
    return original.call(valueAccessor, (value: unknown) => {
      return fn(typeof value === 'string' ? value.trim() : value);
    });
  };
}

import { AbstractControl } from '@angular/forms';
export function removeSpaces(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
  }
  return null;
}