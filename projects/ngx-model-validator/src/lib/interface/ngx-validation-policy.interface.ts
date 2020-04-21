import { NgxValidatorHelper } from '../util/ngx-validator-helper';
import { NgxValidatorRules } from '../util/ngx-validator-rules';

// policy should implement this
export interface NgxValidationPolicy {
    addValidations(ngxValidatorHelper: NgxValidatorHelper): NgxValidatorRules[];
}


/**
 * Sample implmentation
 * 
import { NgxValidatorRules, NgxValidatorHelper, NgxValidationPolicy } from 'ngx-validation';

export class EmployeeValidation implements NgxValidationPolicy {

    addValidations(ngxValidatorHelper: NgxValidatorHelper): NgxValidatorRules[] {
        const NgxValidations = [
            ngxValidatorHelper.validateFor('name').isRequired('Name is required'),
            ngxValidatorHelper.validateFor('age').isRequired('Age is required')
        ];

        return NgxValidations;
    }
}


 */