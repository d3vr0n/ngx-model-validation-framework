
import { NgxValidatorHelper , NgxValidationPolicy } from 'ngx-model-validator';

export class Big100ValidationPolicy implements NgxValidationPolicy {

    addValidations(validatorHelper: NgxValidatorHelper): any[] {

        const personValidations = [
            validatorHelper.validateFor('section1.label1').isRequired('This is required'),
            validatorHelper.validateFor('section1.label2').isRequired('This is required'),
            validatorHelper.validateFor('section1.label3').isRequired('This is required'),
            validatorHelper.validateFor('section1.label4').isRequired('This is required'),
            validatorHelper.validateFor('section1.label5').isRequired('This is required'),
            validatorHelper.validateFor('section1.label6').isRequired('This is required'),
            validatorHelper.validateFor('section1.label7').isRequired('This is required'),
            validatorHelper.validateFor('section1.label8').isRequired('This is required'),
            validatorHelper.validateFor('section1.label9').isRequired('This is required'),
            validatorHelper.validateFor('section1.label10').isRequired('This is required'),

            validatorHelper.validateFor('section2.label1').isRequired('This is required'),
            validatorHelper.validateFor('section2.label2').isRequired('This is required'),
            validatorHelper.validateFor('section2.label3').isRequired('This is required'),
            validatorHelper.validateFor('section2.label4').isRequired('This is required'),
            validatorHelper.validateFor('section2.label5').isRequired('This is required'),
            validatorHelper.validateFor('section2.label6').isRequired('This is required'),
            validatorHelper.validateFor('section2.label7').isRequired('This is required'),
            validatorHelper.validateFor('section2.label8').isRequired('This is required'),
            validatorHelper.validateFor('section2.label9').isRequired('This is required'),
            validatorHelper.validateFor('section2.label10').isRequired('This is required'),

            validatorHelper.validateFor('section3.label1').isRequired('This is required'),
            validatorHelper.validateFor('section3.label2').isRequired('This is required'),
            validatorHelper.validateFor('section3.label3').isRequired('This is required'),
            validatorHelper.validateFor('section3.label4').isRequired('This is required'),
            validatorHelper.validateFor('section3.label5').isRequired('This is required'),
            validatorHelper.validateFor('section3.label6').isRequired('This is required'),
            validatorHelper.validateFor('section3.label7').isRequired('This is required'),
            validatorHelper.validateFor('section3.label8').isRequired('This is required'),
            validatorHelper.validateFor('section3.label9').isRequired('This is required'),
            validatorHelper.validateFor('section3.label10').isRequired('This is required'),

            validatorHelper.validateFor('section4.label1').isRequired('This is required'),
            validatorHelper.validateFor('section4.label2').isRequired('This is required'),
            validatorHelper.validateFor('section4.label3').isRequired('This is required'),
            validatorHelper.validateFor('section4.label4').isRequired('This is required'),
            validatorHelper.validateFor('section4.label5').isRequired('This is required'),
            validatorHelper.validateFor('section4.label6').isRequired('This is required'),
            validatorHelper.validateFor('section4.label7').isRequired('This is required'),
            validatorHelper.validateFor('section4.label8').isRequired('This is required'),
            validatorHelper.validateFor('section4.label9').isRequired('This is required'),
            validatorHelper.validateFor('section4.label10').isRequired('This is required'),

            validatorHelper.validateFor('section5.label1').isRequired('This is required'),
            validatorHelper.validateFor('section5.label2').isRequired('This is required'),
            validatorHelper.validateFor('section5.label3').isRequired('This is required'),
            validatorHelper.validateFor('section5.label4').isRequired('This is required'),
            validatorHelper.validateFor('section5.label5').isRequired('This is required'),
            validatorHelper.validateFor('section5.label6').isRequired('This is required'),
            validatorHelper.validateFor('section5.label7').isRequired('This is required'),
            validatorHelper.validateFor('section5.label8').isRequired('This is required'),
            validatorHelper.validateFor('section5.label9').isRequired('This is required'),
            validatorHelper.validateFor('section5.label10').isRequired('This is required'),

            validatorHelper.validateFor('section6.label1').isRequired('This is required'),
            validatorHelper.validateFor('section6.label2').isRequired('This is required'),
            validatorHelper.validateFor('section6.label3').isRequired('This is required'),
            validatorHelper.validateFor('section6.label4').isRequired('This is required'),
            validatorHelper.validateFor('section6.label5').isRequired('This is required'),
            validatorHelper.validateFor('section6.label6').isRequired('This is required'),
            validatorHelper.validateFor('section6.label7').isRequired('This is required'),
            validatorHelper.validateFor('section6.label8').isRequired('This is required'),
            validatorHelper.validateFor('section6.label9').isRequired('This is required'),
            validatorHelper.validateFor('section6.label10').isRequired('This is required'),

            validatorHelper.validateFor('section7.label1').isRequired('This is required'),
            validatorHelper.validateFor('section7.label2').isRequired('This is required'),
            validatorHelper.validateFor('section7.label3').isRequired('This is required'),
            validatorHelper.validateFor('section7.label4').isRequired('This is required'),
            validatorHelper.validateFor('section7.label5').isRequired('This is required'),
            validatorHelper.validateFor('section7.label6').isRequired('This is required'),
            validatorHelper.validateFor('section7.label7').isRequired('This is required'),
            validatorHelper.validateFor('section7.label8').isRequired('This is required'),
            validatorHelper.validateFor('section7.label9').isRequired('This is required'),
            validatorHelper.validateFor('section7.label10').isRequired('This is required'),

            validatorHelper.validateFor('section8.label1').isRequired('This is required'),
            validatorHelper.validateFor('section8.label2').isRequired('This is required'),
            validatorHelper.validateFor('section8.label3').isRequired('This is required'),
            validatorHelper.validateFor('section8.label4').isRequired('This is required'),
            validatorHelper.validateFor('section8.label5').isRequired('This is required'),
            validatorHelper.validateFor('section8.label6').isRequired('This is required'),
            validatorHelper.validateFor('section8.label7').isRequired('This is required'),
            validatorHelper.validateFor('section8.label8').isRequired('This is required'),
            validatorHelper.validateFor('section8.label9').isRequired('This is required'),
            validatorHelper.validateFor('section8.label10').isRequired('This is required'),

            validatorHelper.validateFor('section9.label1').isRequired('This is required'),
            validatorHelper.validateFor('section9.label2').isRequired('This is required'),
            validatorHelper.validateFor('section9.label3').isRequired('This is required'),
            validatorHelper.validateFor('section9.label4').isRequired('This is required'),
            validatorHelper.validateFor('section9.label5').isRequired('This is required'),
            validatorHelper.validateFor('section9.label6').isRequired('This is required'),
            validatorHelper.validateFor('section9.label7').isRequired('This is required'),
            validatorHelper.validateFor('section9.label8').isRequired('This is required'),
            validatorHelper.validateFor('section9.label9').isRequired('This is required'),
            validatorHelper.validateFor('section9.label10').isRequired('This is required'),

            validatorHelper.validateFor('section10.label1').isRequired('This is required'),
            validatorHelper.validateFor('section10.label2').isRequired('This is required'),
            validatorHelper.validateFor('section10.label3').isRequired('This is required'),
            validatorHelper.validateFor('section10.label4').isRequired('This is required'),
            validatorHelper.validateFor('section10.label5').isRequired('This is required'),
            validatorHelper.validateFor('section10.label6').isRequired('This is required'),
            validatorHelper.validateFor('section10.label7').isRequired('This is required'),
            validatorHelper.validateFor('section10.label8').isRequired('This is required'),
            validatorHelper.validateFor('section10.label9').isRequired('This is required'),
            validatorHelper.validateFor('section10.label10').isRequired('This is required'),

        ];

        return personValidations;
    }

}

