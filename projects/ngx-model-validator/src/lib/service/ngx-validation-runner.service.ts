import { Injectable, NgZone } from '@angular/core';
import { NgxValidationPolicy } from '../interface/ngx-validation-policy.interface';
import { NgxValidatorRules } from '../util/ngx-validator-rules';
import { NgxValidatorHelper } from '../util/ngx-validator-helper';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { compile } from '../expression_parser/parse_main';
import { NgxValidationResult, NgxValidationEvent } from '../interface/ngx-validation-result-model.interface';

@Injectable()
export class NgxValidationRunnerService {
    private policies: { [key: string]: NgxValidatorRules[] } = {};
    private validationListeners: { [key: string]: BehaviorSubject<NgxValidationEvent> } = {};
    private requiredListeners: { [key: string]: Subject<NgxValidationEvent> } = {};

    private _requiredCheckQueue = [];

    constructor(private ngZone: NgZone) {
        this.ngZone.runOutsideAngular(() => {
            setInterval(() => {
                if (this._requiredCheckQueue.length > 0) {
                    const callArgs = this._requiredCheckQueue[this._requiredCheckQueue.length - 1];
                    this._requiredCheckQueue = [];
                    this._runRequiredCheck.call(this, ...callArgs);
                }
            }, 1000);
        });
    }
    register(policyName: string, policy: NgxValidationPolicy) {
        const existingPolicy = this.getPolicy(policyName);
        if (!!existingPolicy && existingPolicy.length > 0) {
            console.warn(`${policyName} is already registered`);
            return existingPolicy;
        }

        const validators = policy.addValidations(new NgxValidatorHelper());

        this.policies[policyName] = validators;
        // for validation emit from svc to component validator
        this.validationListeners[policyName] = new BehaviorSubject<NgxValidationEvent>(<NgxValidationEvent>{});
        // for required emit from svc to component validator
        this.requiredListeners[policyName] = new Subject<NgxValidationEvent>();

        return [...this.policies[policyName]];
    }

    getPolicy(policyName: string) {
        if (this.policies[policyName]) {
            return [...this.policies[policyName]];
        } else {
            return [];
        }
    }
    getValidationListener(policyName: string) {
        return this.validationListeners[policyName].asObservable().pipe(share());
    }
    getRequiredCheckListener(policyName: string) {
        return this.requiredListeners[policyName].asObservable().pipe(share());
    }

    validate(policyName, model, propertyName?) {

        if (!policyName) { throw new Error('policyName is required and should be passed'); }

        const policies = this.getPolicy(policyName);
        const validationSubject = this.validationListeners[policyName];

        let validationModelResult = [];
        let validatorsExcutedCount = 0;
        const responseSubject = new Subject<Array<NgxValidationResult>>();

        if (propertyName) {
            // read previous result from behavior subject
            validationModelResult = !!validationSubject.value.errors ? validationSubject.value.errors : [];

            validationModelResult = validationModelResult.filter(item => item.propertyName !== propertyName);
            let policy: NgxValidatorRules = policies.find(item => item.propertyName === propertyName);

            if (policy) {
                // using IIFE
                (async() => {
                    this._executeValidation(policy, model, validationModelResult).then(()=>{
                        ++validatorsExcutedCount;
                        if (validatorsExcutedCount === 1) {
                            const response = <NgxValidationEvent>{
                                type: 'validation',
                                errors: validationModelResult
                            };
                            validationSubject.next(response);
                            responseSubject.next(validationModelResult);
                        }
                    })
                })();
            }

        } else {

            Object.keys(policies).forEach((key) => {
                let policy: NgxValidatorRules = policies[key];
                if (policy) {
                    // using IIFE
                    (async () => {
                        this._executeValidation(policy, model, validationModelResult).then(()=>{

                            ++validatorsExcutedCount;
                            if (validatorsExcutedCount === policies.length) {
                                const response = <NgxValidationEvent>{
                                    type: 'validation',
                                    errors: validationModelResult
                                };
                                validationSubject.next(response);
                                responseSubject.next(validationModelResult);
                            }

                        });
                    })();
                }
            }, this);
        }
        return responseSubject.asObservable();
    }

    private _executeValidation = async (policy, model, validationModelResult) => {

        let dependencyOutput = true;

        if (policy.dependency) {
            if (typeof (policy.dependency) === 'function') {
                dependencyOutput = await policy.dependency.call(this, model);

            } else {

                const comFn = compile(policy.dependency);
                const dependentValueEvaluated = comFn(model);

                dependencyOutput = dependentValueEvaluated;
            }
        }
        // if no dependency
        if (dependencyOutput === true) {

            const comFn = compile(policy.propertyName);
            const propValueEvaluated = comFn(model);

            if (policy.validationFns.length > 0) {
                // `${policy.propertyName.split('.').join(' ')} is required`
                await policy.validationFns[0].call(this, propValueEvaluated, policy, model);

            }
            if (!!policy.errorMsg) {
                // add the first error
                validationModelResult.push(this.createError(policy.propertyName, policy.errorMsg));
                return;

            } else {

                // loop through rest of the validation functions if error not found
                for (let cur = 1; cur < policy.validationFns.length; cur++) {
                    await policy.validationFns[cur].call(this, propValueEvaluated, policy, model);

                    if (!!policy.errorMsg) {
                        validationModelResult.push(this.createError(policy.propertyName, policy.errorMsg));
                    }
                }
            }

        }
    }

    markForRequiredCheck(policyName, model) {
        this._requiredCheckQueue.push([policyName, model]);
    }

    private _runRequiredCheck(policyName, model) {

        if (!policyName) { throw new Error('policyName is required and should be passed'); }

        const policies = this.getPolicy(policyName);
        const requiredCheckSubject = this.requiredListeners[policyName];

        // no need to read from previous value
        let requiredModelResult = [];

        Object.keys(policies).forEach((key) => {
            let policy: NgxValidatorRules = policies[key];
            if(policy) {
                this._executeRequiredCheckOnModel(policy, model, requiredModelResult);
            }
        }, this);

        const response = <NgxValidationEvent>{
            type: 'required',
            errors: requiredModelResult
        };
        requiredCheckSubject.next(response);
        return (of(requiredModelResult));
    }

    private _executeRequiredCheckOnModel = (policy, model, requiredModelResult) => {
        let dependencyOutput = true;

        if (policy.dependency) {
            if (typeof (policy.dependency) === 'function') {
                dependencyOutput = policy.dependency.call(this, model);

            } else {

                const comFn = compile(policy.dependency);
                const dependentValueEvaluated = comFn(model);

                dependencyOutput = dependentValueEvaluated;
            }
        }
        // if no dependency
        if (dependencyOutput === true) {

            // means required
            requiredModelResult.push(this.createError(policy.propertyName, 'required'));

        }
    }

    createError(propertyName, errorMessage): NgxValidationResult {
        return <NgxValidationResult>{
            propertyName,
            errorMessage
        }
    }

}