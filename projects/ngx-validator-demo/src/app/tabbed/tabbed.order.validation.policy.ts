
import { NgxValidatorHelper , NgxValidationPolicy } from 'ngx-model-validator';

export class OrderValidationPolicy implements NgxValidationPolicy {

    addValidations(validatorHelper: NgxValidatorHelper): any[] {


        const personValidations = [
            validatorHelper.validateFor('person.firstName').isRequired('First Name is required'),
            validatorHelper.validateFor('person.lastName').isRequired('Last Name is required'),
            validatorHelper.validateFor('person.email').isRequired('Email is required').isRegex('Enter valid email', 
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),

            validatorHelper.validateFor('address.line1').isRequired('Street address is required'),
            // validatorHelper.validateFor('address.line2').isRequired('Street address2 is required'),
            validatorHelper.validateFor('address.city').isRequired('City name is required'),
            validatorHelper.validateFor('address.state').isRequired('State name is required'),
            validatorHelper.validateFor('address.zip').isRequired('Zip is required')
                .isNumber('Zip must be a number').isRegex('Enter valid zip', /[0-9]{5,5}/),

            validatorHelper.validateFor('payment.cardno').isRequired('Card number is required'),
            validatorHelper.validateFor('payment.expiry').isRequired('Card expiry is required'),
            validatorHelper.validateFor('payment.name').isRequired('Name on Card is required'),
            validatorHelper.validateFor('payment.cvv').isRequired('Card CVV is required').isNumber('Zip must be a number')
                .isRegex('Enter valid 3 digit CVV', /[0-9]{3,3}/),
        ];

        return personValidations;
    }

}

