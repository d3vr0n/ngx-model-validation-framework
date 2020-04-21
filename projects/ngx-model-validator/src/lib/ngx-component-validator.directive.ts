import {
    AfterViewInit, Directive, DoCheck, OnInit, OnChanges, OnDestroy, Input, SimpleChanges, IterableDiffers, IterableDiffer, IterableChangeRecord, NgZone
} from '@angular/core';

import { NgxValidationRunnerService } from './service/ngx-validation-runner.service';
import { Subscription } from 'rxjs';
import { NgxValidationEvent, NgxValidationResult } from './interface/ngx-validation-result-model.interface';


// Top level component validation enabler
// this shall check for updated validation result and
// publish to ngx-mat-validator via observable and runner service

@Directive({
    selector: 'ngx-component-validator'
})
export class NgxComponentValidatorDirective implements OnInit, OnChanges, AfterViewInit, DoCheck, OnDestroy {

    @Input() model: any;

    @Input() policy: string;

    @Input() policyFnRef: any; // function ref

    private _iterableValidationDiffer: IterableDiffer<any>;
    private _iterableRequiredDiffer: IterableDiffer<any>;
    private validationListenerSubscription: Subscription;
    private requiredListenerSubscription: Subscription;

    constructor(
        private differs: IterableDiffers, private ngZone: NgZone,
        private validationService: NgxValidationRunnerService) {

    }


    ngOnInit(): void {


    }

    trackByFcForNgxValidationResult = (index,item:NgxValidationResult)=>{
        return `${item.propertyName} - ${item.errorMessage}`;
    };

    ngOnChanges(changes: SimpleChanges): void {

        if (this.policy && this.policyFnRef) {
            const policy = this.validationService.register(this.policy, new this.policyFnRef());

            if (!this._iterableValidationDiffer) {
                this._iterableValidationDiffer = this.differs.find([]).create(this.trackByFcForNgxValidationResult);
            }
            if (!this._iterableRequiredDiffer) {
                this._iterableRequiredDiffer = this.differs.find([]).create(this.trackByFcForNgxValidationResult);
            }
            // subscribe to observable
            if (!this.validationListenerSubscription)
                this.validationListenerSubscription =
                    this.validationService.getValidationListener(this.policy).subscribe((validatorResult: NgxValidationEvent) => {
                        // debugger
                        if (validatorResult.type === 'validation') {
                            const differResult = this._iterableValidationDiffer.diff(validatorResult.errors);

                            this.ngZone.runOutsideAngular(() => {
                                if (differResult) {
                                    differResult.forEachRemovedItem((changeRecord: IterableChangeRecord<any>) => {
                                        var payload = { ...changeRecord.item, operation: 'removed', type: 'validation' };

                                        /**
                                         * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
                                         */
                                        window.postMessage(payload, window.location.origin);
                                    });

                                    differResult.forEachAddedItem((changeRecord: IterableChangeRecord<any>) => {
                                        var payload = { ...changeRecord.item, operation: 'added', type: 'validation' };

                                        /**
                                         * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
                                         */
                                        window.postMessage(payload, window.location.origin);
                                    });
                                }
                            });
                        } else {
                            /** do nothing */
                        }

                    });

            if (!this.requiredListenerSubscription)
                this.requiredListenerSubscription =
                    this.validationService.getRequiredCheckListener(this.policy).subscribe((validatorResult: NgxValidationEvent) => {
                        // debugger
                        if (validatorResult.type === 'required') {
                            const differResult = this._iterableRequiredDiffer.diff(validatorResult.errors);

                            if (differResult) {
                                this.ngZone.runOutsideAngular(() => {
                                    differResult.forEachRemovedItem((changeRecord: IterableChangeRecord<any>) => {
                                        var payload = { ...changeRecord.item, operation: 'removed', type: 'required' };

                                        /**
                                         * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
                                         */
                                        window.postMessage(payload, window.location.origin);
                                    });

                                    differResult.forEachAddedItem((changeRecord: IterableChangeRecord<any>) => {
                                        var payload = { ...changeRecord.item, operation: 'added', type: 'required' };

                                        /**
                                         * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
                                         */
                                        window.postMessage(payload, window.location.origin);
                                    });
                                });
                            }
                        } else {
                            /** do nothing */
                        }

                    });
        }
    }

    ngAfterViewInit() {

    }

    ngDoCheck(): void {

    }

    ngOnDestroy(): void {
        this.validationListenerSubscription.unsubscribe();
        this.requiredListenerSubscription.unsubscribe();
    }


}