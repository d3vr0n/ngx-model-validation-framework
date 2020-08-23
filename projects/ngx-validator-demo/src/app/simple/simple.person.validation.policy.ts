
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

        const cityAndStateAsyncValidatorFn = async(errorMsg:string, val :any, policy:any, model:any)=>{

            // api key get resets everyday - get new one while testing
            const api_key = "GIRvd3rWAdY8VCNxuy97WavI6qBmXDAGQZOty0my1uPCnMrNVt37J6oT8unGYwXE";
            const url = `https://www.zipcodeapi.com/rest/${api_key}/info.json/${val}/radians`;
            const result = await (await fetch(url)).json();

            if(result){
                if(result.state === model.address.state) {
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
            // validatorHelper.validateFor('address.line2').isRequired('Street address2 is required'),
            validatorHelper.validateFor('address.city','address.line1.length > 0').isRequired('City name is required'),
            validatorHelper.validateFor('address.state','address.line1.length > 0').isRequired('State name is required'),
            validatorHelper.validateFor('address.zip','address.line1.length > 0').isRequired('Zip is required').isNumber('Zip must be a number')
                .customValidator('Invalid Zip Code, does not match with City and State', cityAndStateAsyncValidatorFn),
        ];

        return personValidations;
    }

}

