# NGX Model Validation Framework

## Overview

NGX Model Validation Framework is a policy-based fluid model validation framework for Angular applications. It provides a structured way to define validation rules for models and apply them to form fields in Angular applications.

## Project Structure

The project consists of two main parts:

1. **ngx-model-validator**: The core library that provides the validation framework
2. **ngx-validator-demo**: A demo application showcasing various validation scenarios

## Key Components

### Core Library Components

1. **NgxValidationPolicy Interface**: Defines the contract for validation policies
   - Located at: `/projects/ngx-model-validator/src/lib/interface/ngx-validation-policy.interface.ts`
   - Validation policies implement this interface to provide validation rules

2. **NgxValidationRunnerService**: Central service for running validations
   - Located at: `/projects/ngx-model-validator/src/lib/service/ngx-validation-runner.service.ts`
   - Handles registration and execution of validation policies

3. **Validator Directives**:
   - `NgxMatValidatorDirective`: Validates Angular Material form fields
   - `NgxBootStrapValidatorDirective`: Validates Bootstrap form fields
   - `NgxComponentValidatorDirective`: Root validator for a component

4. **Validator Helper and Rules**:
   - Located at: `/projects/ngx-model-validator/src/lib/util/`
   - Provides utility functions to create validation rules

### Demo Application Components

1. **Simple Validation Example**: Basic example showcasing form validation
   - Located at: `/projects/ngx-validator-demo/src/app/simple/`

2. **Tabbed Validation Example**: Example showing validation across tabbed interfaces
   - Located at: `/projects/ngx-validator-demo/src/app/tabbed/`

3. **Group Validation Example**: Example showing validation in field groups
   - Located at: `/projects/ngx-validator-demo/src/app/group/`

4. **Big100 Example**: Complex example with many fields and sections
   - Located at: `/projects/ngx-validator-demo/src/app/big100/`

5. **Bootstrap Form Example**: Example using Bootstrap styling
   - Located at: `/projects/ngx-validator-demo/src/app/bootstrap-form/`

## Key Features

1. **Policy-based Validation**: Define validation rules in a centralized policy
2. **Fluid API**: Use chainable methods to define validation rules
3. **Framework Agnostic**: Support for both Angular Material and Bootstrap
4. **Async Validation**: Support for asynchronous validation rules
5. **Expression-based Validation**: Conditional validation based on other field values
6. **Custom Validation**: Ability to define custom validation rules

## How to Use

### 1. Define a Validation Policy

```typescript
import { NgxValidatorHelper, NgxValidationPolicy } from 'ngx-model-validator';

export class PersonValidationPolicy implements NgxValidationPolicy {
  addValidations(validatorHelper: NgxValidatorHelper): any[] {
    const personValidations = [
      validatorHelper.validateFor('firstName').isRequired('First Name is required'),
      validatorHelper.validateFor('age').isRequired('Age is required').isNumber('Age should be number')
        .isNumberWithinRange('Age should be between 10 and 60', [10, 60]),
      validatorHelper.validateFor('email').isRequired('Email is required').isRegex('Enter valid email', 
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    ];
    
    return personValidations;
  }
}
```

### 2. Import the Module

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
export class AppModule {}
```

### 3. Use in Component Template

```html
<ngx-component-validator [model]="person" [policy]="PERSON_POLICY_NAME" 
    [policyFnRef]="PERSON_VALIDATION_FN"></ngx-component-validator>

<mat-form-field>
    <input matInput placeholder="First Name" ngxMatValidate [model]="person"
        validateProperty="firstName" [policy]="PERSON_POLICY_NAME"
        [(ngModel)]="person.firstName" />
</mat-form-field>
```

### 4. Component Class

```typescript
import { Component } from '@angular/core';
import { PersonValidationPolicy } from './person.validation.policy';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  public PERSON_POLICY_NAME = 'person-validation';
  public PERSON_VALIDATION_FN = PersonValidationPolicy;
  
  public person = {
    firstName: '',
    age: '',
    email: ''
  };
  
  // ... other methods
}
```

## Available Validation Rules

- **isRequired**: Field must have a value
- **isNumber**: Field must be a number
- **isNumberWithinRange**: Number must be within a specified range
- **isRegex**: Field must match a regular expression
- **customValidator**: Define a custom validation function

## Angular Material Integration

The framework automatically handles Angular Material styling for validation errors. It adds appropriate CSS classes to show error messages under form fields.

## Bootstrap Integration

For Bootstrap forms, use the `ngxBootStrapValidate` directive instead of `ngxMatValidate`.

## Technical Notes

- The framework uses Angular's directive system to apply validation
- Uses the browser's postMessage mechanism to communicate validation events
- Supports nested properties (e.g., 'address.city')
- Supports conditional validation based on other field values
- Compatible with Angular's FormsModule and ngModel
