
<a name="1.1.1"></a>
# [1.1.1](https://github.com/d3vr0n/ngx-model-validation-framework/releases) (2020-08-25)
* **Angular update to v9**
* **fix:** no value accessor for form control with unspecified name attribute
* **fix:** error message was not disappearing as soon as we tab out of field

<a name="1.0.0"></a>
# [1.0.0](https://github.com/d3vr0n/ngx-model-validation-framework/releases) (2020-04-26)


## Features

* **component validator:** Validates the model for a component
* **mat validator:** Adds validation error to mat control
* **mat required validator:** Adds required * to mat control
* **bootstrap validator:** Adds validation error message to bootstrap control is using along with angular
* **mat group validator:** Adds section group validation check for mat controls only, closes [#1](https://github.com/d3vr0n/ngx-model-validation-framework/issues/1)
* **fluid validation api with async await support for asyncvalidators:** Validation policy can be defined as chainable api. You shall be able to make api call to check for validations using customvalidator. [Check Demo](https://github.com/d3vr0n/ngx-model-validation-framework/blob/master/projects/ngx-validator-demo/src/app/simple/simple.person.validation.policy.ts#L17)
* **minimal footprint:** 50KB bundeled-minified

## In-build validator apis

### Following validator apis are defined - 
 - isRequired
 - isNumberWithinRange
 - isNumber
 - isRegex
 - customValidator
