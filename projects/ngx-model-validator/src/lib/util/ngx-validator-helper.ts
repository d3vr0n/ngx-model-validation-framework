import { NgxValidatorRules } from './ngx-validator-rules';

export class NgxValidatorHelper {

  constructor() { }

  validateFor = (propName: string, dependency?: any): NgxValidatorRules => {
    const ngxValidatorRules = new NgxValidatorRules();

    ngxValidatorRules.propertyName = propName;
    ngxValidatorRules.dependency = dependency;

    return ngxValidatorRules;
  }
}
