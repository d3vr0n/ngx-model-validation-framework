# ngx-validation-framework

A policy based fluid model validation framework for Angular projects.

[![npm version](https://badge.fury.io/js/ngx-model-validator.svg)](https://www.npmjs.com/ngx-model-validator)
[![CircleCI](https://circleci.com/gh/d3vr0n/ngx-model-validation-framework/tree/master.svg?style=svg)](https://circleci.com/gh/d3vr0n/ngx-model-validation-framework/tree/master)

# Installation

```bash
npm i ngx-model-validator --save
```

# Usage

 - Simple validation with error display on field
```html
<ngx-component-validator [model]="person" [policy]="PERSON_POLICY_NAME" [policyFnRef]="PERSON_VALIDATION_FN"></ngx-component-validator>

<input matInput placeholder="First Name" ngxMatValidate [model]="person" validateProperty="firstName" [policy]="PERSON_POLICY_NAME" [(ngModel)]="person.firstName" />
``` 
import `NgxValidationModule` in *app.module.ts*

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxValidationModule } from 'ngx-model-validator';

import { AppComponent } from './app.component';

@NgModule({
    imports: [BrowserModule, FormsModule, NgxValidationModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```
```typescript
// policy

import { NgxValidatorHelper , NgxValidationPolicy } from 'ngx-model-validator';

export class PersonValidationPolicy implements NgxValidationPolicy {

    addValidations(validatorHelper: NgxValidatorHelper): any[] {

        const lastNameValidatorFn = (model, ...args) => {
            
            if(model.firstName && model.firstName.length > 1) {
                return true;
            } else {
                return false;
            }
        }

        const cityAndStateAsyncValidatorFn = async(errorMsg:string, val :any, policy:any)=>{

            const url = `some url`;
            const result = await (await fetch(url)).json();

            if(result){
                if(result.state === val) {
                    return true;
                }
            } 
            
            policy.errorMsg = errorMsg
            
        }


        const personValidations = [
            validatorHelper.validateFor('firstName').isRequired('First Name is required'),
            validatorHelper.validateFor('lastName', lastNameValidatorFn).isRequired('Last Name is required'),
            validatorHelper.validateFor('age').isRequired('Age is required').isNumber('Age should be number')
                .isNumberWithinRange('Age should be between 10 and 60', [10,60]),
            validatorHelper.validateFor('gender').isRequired('Gender is required'),
            validatorHelper.validateFor('email').isRequired('Email is required').isRegex('Enter valid email', 
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
            validatorHelper.validateFor('address.line1').isRequired('Street address is required'),
            validatorHelper.validateFor('address.city','address.line1.length > 0').isRequired('City name is required'),
            validatorHelper.validateFor('address.state','address.line1.length > 0').isRequired('State name is required'),
            validatorHelper.validateFor('address.zip','address.line1.length > 0').isRequired('Zip is required').isNumber('Zip must be a number')
                .customValidator('Invalid Zip Code, does not match with City and State', cityAndStateAsyncValidatorFn),
        ];

        return personValidations;
    }

}



// component
import { PersonValidationPolicy } from './simple.person.validation.policy';
import { NgxValidationRunnerService } from 'ngx-model-validator';

public PERSON_POLICY_NAME = 'simple-person-validation';
public PERSON_VALIDATION_FN = PersonValidationPolicy;

constructor(private valRunnerSvc: NgxValidationRunnerService){ }

validate() {
    this.valRunnerSvc.validate(this.PERSON_POLICY_NAME, this.person)
}
``` 
 - Simple validation without error display on field, errors to be handled in component
 ```html
<ngx-component-validator [model]="person" [policy]="PERSON_POLICY_NAME" [policyFnRef]="PERSON_VALIDATION_FN"></ngx-component-validator>

<input matInput placeholder="First Name" [(ngModel)]="person.firstName" />
``` 
```typescript
// policy
validatorHelper.validateFor('firstName').isRequired('First Name is required'),

// component
this.valRunnerSvc.validate(this.PERSON_POLICY_NAME, this.person).subscribe(result=>{
      if(result && result.length > 0) {
         console.error('Validation error found');
      }
    });
``` 
- Simple validation with required * and error display on field
```html
<ngx-component-validator [model]="person" [policy]="PERSON_POLICY_NAME" [policyFnRef]="PERSON_VALIDATION_FN"></ngx-component-validator>

<input matInput placeholder="First Name" ngxMatValidate ngxMatRequired [model]="person" validateProperty="firstName" [policy]="PERSON_POLICY_NAME" [(ngModel)]="person.firstName" />
``` 
```typescript
// policy
validatorHelper.validateFor('firstName').isRequired('First Name is required'),

// component
this.valRunnerSvc.validate(this.PERSON_POLICY_NAME, this.person)
``` 

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

