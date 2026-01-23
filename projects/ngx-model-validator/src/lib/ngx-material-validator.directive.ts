import {
  AfterViewInit, Directive, OnInit, Renderer2, ElementRef, OnDestroy, Input, NgZone, Inject
} from '@angular/core';

import { NgxValidationRunnerService } from './service/ngx-validation-runner.service';
import { WINDOW } from './util/window-ref';


// TODO : abstract the validation logic in a base class and use it in a child class for
// any type of UI, e.g. material, bootstrap etc.
// usage    
//   ngxMatValidate [validateProperty]="person.age" [model]="person" [policy]="PERSON_POLICY_NAME" [(ngModel)]="person.age"

// try follow https://github.com/rsaenen/ngx-custom-validators/blob/master/src/app/less-than/directive.ts

@Directive({
    selector: '[ngModel][ngxMatValidate]',
    standalone: false
})
export class NgxMatValidatorDirective implements OnInit, AfterViewInit, OnDestroy {

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
    private elementRef: ElementRef, private ngZone: NgZone,
    private renderer2: Renderer2,/* private ngModel: NgModel,*/
    @Inject(WINDOW) private _window: any) {

  }


  ngOnInit(): void {
    /**
     * add message event listener
     * message shall come from component validator directive
     */
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    this.ngZone.runOutsideAngular(() => {
      this._window.addEventListener("message", (event: MessageEvent) => {

        if (event.data.type === 'validation' && event.data.propertyName === this.validateProperty) {
          
          /**
           * should I skip validation if control is disabled ??
           */
          this.addErrorToMatControl(event.data.operation === 'added' ? event.data.errorMessage : null);
        }
      }, false);
    });
  }

  ngAfterViewInit() {
    this.testMatElementType();
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
      const delay = (this.isRadioButton || this.isCheckbox) ? 200 : 0;
      // run validation after the delay
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.validationService.validate(this.policy, this.model, this.validateProperty); // no need to subscribe here
        }, delay);
      });
    });

    // this.ngModel.valueChanges.subscribe((value)=>{
    //   this.validationService.validate(this.policy, this.model, this.validateProperty); // no need to subscribe here
    // });

  }

  ngOnDestroy(): void {

  }

  testMatElementType() {
    const node = this.elementRef.nativeElement;

    this.depthOfParentNode = 5; // till what depth we want to search
    const classList = [...node.classList];
    const elementClass = classList.reduce((acc, value) => {

      value = value.toUpperCase();

      if (value === 'MAT-MDC-INPUT-ELEMENT' || value === 'MAT-MDC-SELECT') {
        acc.push('MAT-MDC-FORM-FIELD'); return acc;
      } else if (value === 'MAT-MDC-RADIO-INPUT' || value === 'MAT-MDC-RADIO-GROUP') {
        acc.push('MAT-MDC-RADIO-GROUP'); return acc;
      } else if (value === 'MAT-MDC-CHECKBOX-INPUT' || value === 'MAT-MDC-CHECKBOX') {
        acc.push('MAT-MDC-CHECKBOX'); return acc;
      } else {
        return acc;
      }
    }, []);

    // Default to MAT-FORM-FIELD if no specific material element class is found
    if (elementClass.length === 0) {
      this.parentNodeName = 'MAT-FORM-FIELD';
      this.depthOfParentNode = 5;
      this.isInput = true;
      return;
    }
    
    switch (elementClass[0].toUpperCase()) {
      case 'MAT-MDC-CHECKBOX':
        this.parentNodeName = 'MAT-CHECKBOX';
        this.depthOfParentNode = 3;
        this.isCheckbox = true;
        break;
      case 'MAT-MDC-RADIO-GROUP':
        this.parentNodeName = 'MAT-RADIO-GROUP';
        this.depthOfParentNode = 3;
        this.isRadioButton = true;
        break;
      case 'MAT-MDC-FORM-FIELD':
      case 'MAT-MDC-SELECT':
        this.parentNodeName = 'MAT-FORM-FIELD';
        this.depthOfParentNode = 4;
        this.isInput = true;
        break;
      default:
        this.parentNodeName = 'MAT-FORM-FIELD';
        this.depthOfParentNode = 5;
        this.isInput = true;
        break;
    }

    if (this.isCheckbox || this.isRadioButton) {

      this.renderer2.addClass(node, 'mat-mdc-form-field');
      let errorValidationContainer = node.querySelector('.ui-validation-transitionMessages');

      if (errorValidationContainer === null) {
        errorValidationContainer = document.createElement('div');

        errorValidationContainer.className = 'ui-validation-transitionMessages';
        node.appendChild(errorValidationContainer);
      }
    }
  }

  addErrorToMatControl(errorMsg: string) {
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

    if (this.isInput) {
      const matErrorContainer = node.querySelector('.ng-trigger-transitionMessages');
      this.addMatErrorsToHtml(matErrorContainer, node, errorMsg, 'mat-mdc-form-field-invalid');

    } else if (this.isRadioButton || this.isCheckbox) {
      const matErrorContainer = node.querySelector('.ui-validation-transitionMessages');
      const errorClass = this.isCheckbox ? 'mat-mdc-checkbox-invalid' : 'mat-mdc-radio-invalid';

      this.addMatErrorsToHtml(matErrorContainer, node, errorMsg, errorClass);
    }

  };


  addMatErrorsToHtml(errorElement: any, node: any, errorMsg: string, cssErrorClass: string) {
    this.ngZone.run(() => {
      if (!!errorElement) {
        const errorExistingNodes = errorElement.querySelectorAll('mat-error');
        this.renderer2.removeClass(node, cssErrorClass);
        if (!!errorExistingNodes && errorExistingNodes.length > 0) {
          errorExistingNodes.forEach(errorNode => {
            this.renderer2.removeChild(errorElement, errorNode);
          });
        }
        // add mat-error block
        if (!!errorMsg) {

          const errorElem = document.createElement('mat-error');
          const textNode = document.createTextNode(errorMsg);
          errorElem.appendChild(textNode);
          errorElem.className = 'mat-mdc-form-field-error mat-mdc-form-field-bottom-align';

          const refDivNode = errorElement.querySelector('div');
          this.renderer2.insertBefore(errorElement, errorElem, refDivNode);
          this.renderer2.addClass(node, cssErrorClass);

        }
      }
    });
  };
}