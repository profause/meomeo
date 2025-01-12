import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  constructor(private formBuilder: FormBuilder) { }

  public createFormInputs(billFormData: any[]): FormArray {
    let tempQ = [];
    billFormData.forEach(element => {
      switch (element.dataType.toLowerCase()) {
        case 'date':
          tempQ.push(this.createDateFormField(element));
          break;
        case 'dateofbirth':
          tempQ.push(this.createDateOfBirthFormField(element));
          break;
        case 'email':
          tempQ.push(this.createEmailFormField(element));
          break;
        case 'jsonarray':
          tempQ.push(this.createJsonArrayFormField(element));
          break;
        default:
          tempQ.push(this.createFormField(element));
          break;
      }

    });
    return new FormArray(tempQ);
  }


  public createFormField(formField: any): FormGroup {
    return this.formBuilder.group(
      {
        name: new FormControl(formField.name),
        sequence: new FormControl(formField?.sequence),
        title: new FormControl(formField.title),
        dataType: new FormControl(formField.dataType.toLowerCase()),
        validateField: new FormControl(formField?.validateField),
        defaultValue: new FormControl(formField?.defaultValue),
        listofValues: new FormControl(formField?.listofValues),
        required: new FormControl(formField.required),
        value: new FormControl(formField?.defaultValue, [formField.required ? Validators.required : Validators.nullValidator,
        formField.validateField ? Validators.required : Validators.nullValidator]),
        errorMessage: new FormControl(formField.errorMessage),
        maxLength: new FormControl(formField?.maxLength),
        minLength: new FormControl(formField?.minLength),
      }
    );
  }

  public createEmailFormField(formField: any): FormGroup {
    return this.formBuilder.group(
      {
        name: new FormControl(formField.name),
        sequence: new FormControl(formField?.sequence),
        title: new FormControl(formField.title),
        dataType: new FormControl(formField.dataType.toLowerCase()),
        validateField: new FormControl(formField?.validateField),
        defaultValue: new FormControl(formField?.defaultValue),
        listofValues: new FormControl(formField?.listofValues),
        required: new FormControl(formField.required),
        value: new FormControl(formField?.defaultValue, [formField.required ? Validators.required : Validators.nullValidator, Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), formField.validateField ? Validators.required : Validators.nullValidator]),
        errorMessage: new FormControl(formField.errorMessage),
        maxLength: new FormControl(formField?.maxLength),
        minLength: new FormControl(formField?.minLength),
      }
    );
  }

  public createDateFormField(formField: any): FormGroup {
    return this.formBuilder.group(
      {
        name: new FormControl(formField.name),
        sequence: new FormControl(formField?.sequence),
        title: new FormControl(formField.title),
        value: new FormControl(formField.value, [formField.required ? Validators.required : Validators.nullValidator,]),
        dataType: new FormControl(formField.dataType.toLowerCase()),
        validateField: new FormControl(formField?.validateField),
        defaultValue: new FormControl(formField?.defaultValue),
        listofValues: new FormControl(formField?.listofValues),
        required: new FormControl(formField.required),
      }
    );
  }

  public createDateOfBirthFormField(formField: any): FormGroup {
    return this.formBuilder.group(
      {
        name: new FormControl(formField.name),
        sequence: new FormControl(formField?.sequence),
        title: new FormControl(formField.title),
        value: new FormControl(new Date(this.getCurrentDate().getFullYear() - 18, 0, 1),[formField.required? Validators.required:Validators.nullValidator,]),
        dataType: new FormControl(formField.dataType.toLowerCase()),
        validateField: new FormControl(formField?.validateField),
        defaultValue: new FormControl(formField?.defaultValue),
        listofValues: new FormControl(formField?.listofValues),
        required: new FormControl(formField.required),
      }
    );
  }


  public createJsonArrayFormField(formField: any): FormGroup {
    //if (undefined != formField) {
    return this.formBuilder.group(
      {
        name: new FormControl(formField.name),
        sequence: new FormControl(formField?.sequence),
        title: new FormControl(formField.title),
        value: new FormControl(formField.value),
        dataType: new FormControl(formField.dataType.toLowerCase()),
        validateField: new FormControl(formField?.validateField),
        defaultValue: new FormControl(formField?.defaultValue),
        listofValues: new FormControl(JSON.parse(formField?.listofValues)),
        required: new FormControl(formField.required),
      }
    );
    //}
  }


  setMinimumDate(y: number, m: number, d: number) {
    return new Date(y, m, d);
  }

  setMaximumDate(y: number, m: number, d: number) {
    return new Date(y, m, d);
  }

  dateStartAt(y: number, m: number, d: number) {
    return new Date(y, m, d);
  }

  getCurrentDate(): Date {
    return new Date();
  }

  public getOptionsAsList(options: string): Array<string> {
    let temp = options.split('|');
    return temp;
  }

  public getOptionsAsJson(options: string): Array<{}> {
    let temp = options.split('|');

    return temp;
  }

  public getOptionsAsJsonArray(options: string): Array<{}> {
    let tempArray = []
    //console.log('options : ' + options);
    //tempArray = JSON.parse(options);
    return tempArray;
  }
}
