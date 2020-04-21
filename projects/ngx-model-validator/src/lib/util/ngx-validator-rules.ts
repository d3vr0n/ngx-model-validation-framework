import { debug } from 'util';

export class NgxValidatorRules {
    public propertyName: string;
    public dependency: string | Function;
    public errorMsg: string | null;
    public validationFns: Array<Function>;

    constructor() {
        this.validationFns = [];
    }

    public isRequired = (errorMsg: string) => {
        this.validationFns.push(this._isRequiredCheck.bind(this, errorMsg));
        return this;
    }

    public isNumberWithinRange = (errorMsg: string, range: Array<number>) => {
        this.validationFns.push(this._isNumberWithinRangeCheck.bind(this, errorMsg, range));
        return this;
    }

    public isNumber = (errorMsg: string) => {
        this.validationFns.push(this._isNumberCheck.bind(this, errorMsg));
        return this;
    }

    public isRegex = (errorMsg: string, regex: RegExp) => {
        this.validationFns.push(this._isRegexCheck.bind(this, errorMsg, regex));
        return this;
    }

    public customValidator = (errorMsg: string, customFunction: any) => {
        if(typeof(customFunction) !== "function"){
            throw new Error(`Invalid custom function. Received ${typeof(customFunction)}`);
        }
        this.validationFns.push(customFunction.bind(this, errorMsg));
        return this;
    }

    //////////////////////////
    // private helper function
    //////////////////////////
    private isNullOrEmpty = (value: any) => {
        // Allow 0 and false as a valid input
        if (!value && value !== 0 && value !== false) {
            return true;
        }

        return false;
    }

    private _isRequiredCheck = (errorMsg: string, value?: any) => {
        if (this.isNullOrEmpty(value)) {
            this.errorMsg = errorMsg || 'This value is required';
        } else {
            this.errorMsg = null;
        }
    }

    private _isNumberCheck = (errorMsg: string, value?: string) => {
        if (isNaN(parseFloat(value))) {
            this.errorMsg = errorMsg || 'It should be number';
        } else {
            this.errorMsg = null;
        }
    }

    private _isNumberWithinRangeCheck = (errorMsg: string, range: Array<number>, value?: string) => {
        if (isNaN(parseFloat(String(value)))) {
            this.errorMsg = 'It should be number';
        } else if(!(parseFloat(value) >= range[0] && parseFloat(value) <= range[1])) {
            this.errorMsg = errorMsg || 'It should be within range';
        } else {
            this.errorMsg = null;
        }
    }

    private _isRegexCheck = (errorMsg: string, regex: RegExp, value?: string) => {

        if (!regex.test(value)) {
            this.errorMsg = errorMsg || 'Invalid value';
        } else {
            this.errorMsg = null;
        }
    }
}