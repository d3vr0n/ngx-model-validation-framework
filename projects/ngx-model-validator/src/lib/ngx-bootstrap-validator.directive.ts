import {
  AfterViewInit, Directive, OnInit, Renderer2, ElementRef, OnDestroy, Input, OnChanges, SimpleChanges
} from '@angular/core';

import { NgxValidationRunnerService } from './service/ngx-validation-runner.service';
import { NgModel } from '@angular/forms';


// TODO : abstract the validation logic in a base class and use it in a child class for
// any type of UI, e.g. material, bootstrap etc.
// usage    
//   ngxMatValidate [validateProperty]="person.age" [model]="person" [policy]="PERSON_POLICY_NAME" [(ngModel)]="person.age"

// try follow https://github.com/rsaenen/ngx-custom-validators/blob/master/src/app/less-than/directive.ts

@Directive({
  selector: '[ngModel][ngxBootStrapValidate]',
  providers: [NgModel]
})
export class NgxBootStrapValidatorDirective implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() validateProperty: any = {};

  @Input() model: any;

  @Input() policy: string;

  @Input() validateOnEvent: string;

  parentNodeName = '';
  depthOfParentNode: number;
  isInput = false;
  isCheckbox = false;
  isRadioButton = false;

  constructor(
    private validationService: NgxValidationRunnerService,
    private elementRef: ElementRef,
    private renderer2: Renderer2, private ngModel: NgModel) {

  }


  ngOnInit(): void {
    /**
     * add message event listener
     * message shall come from component validator directive
     */
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    window.addEventListener("message", (event: MessageEvent) => {

      if (event.data.propertyName === this.validateProperty) {
        // debugger;
        this.addErrorToBootstrapControl(event.data.operation === 'added' ? event.data.errorMessage : null);
      }
    }, false);
  }

  ngAfterViewInit() {
    this.testBootstrapElementType();
    // Default event 'click' for mat-checkbox and mat-radio-group types
    // And Default event 'blur' for input, select etc.
    /**
     * try using hostlistener here
     */
    const event = !!this.validateOnEvent ? this.validateOnEvent : (this.isRadioButton || this.isCheckbox) ? 'click' : 'blur';

    this.renderer2.listen(this.elementRef.nativeElement, event, () => {
      // todo call central validation runner here
      // Delay the execution of validate by 200ms as the ngModel value needs to be updated.
      // This is workaround for mat-checkbox and mat-radio-group elements
      // const delay = (this.isRadioButton || this.isCheckbox) ? 200 : 0;
      // run validation after the delay

      this.validationService.validate(this.policy, this.model, this.validateProperty); // no need to subscribe here
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO : trigger validation of whole model
  }

  ngOnDestroy(): void {

  }

  testBootstrapElementType() {
    const node = this.elementRef.nativeElement;

    
  }

  addErrorToBootstrapControl(errorMsg: string) {
    let node = this.elementRef.nativeElement;
    const maxDept = 5;  // Using this as mat elements depth of Parent doesn't exceed 5
    let loopCount = 0;

    while (loopCount < maxDept) {
      if (node.nodeName.toUpperCase() === this.parentNodeName) {
        break;
      } else {
        node = node.parentNode;
      }
      loopCount++;
    }

  };

  
  addBootstrapErrorsToHtml(errorElement: any, node: any, errorMsg: string, cssErrorClass: string) {
     throw new Error('Not implemented')
  };
}