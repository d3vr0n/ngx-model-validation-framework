import {
  AfterViewInit, Directive, OnInit, Renderer2, ElementRef, OnDestroy, Input, OnChanges, SimpleChanges, NgZone
} from '@angular/core';

import { NgxValidationRunnerService } from './service/ngx-validation-runner.service';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';


// TODO : abstract the validation logic in a base class and use it in a child class for
// any type of UI, e.g. material, bootstrap etc.
// usage    
//   ngxMatRequired [validateProperty]="person.age" [model]="person" [policy]="PERSON_POLICY_NAME" [(ngModel)]="person.age"

@Directive({
  selector: '[ngModel][ngxMatRequired]',
  providers: [NgModel]
})
export class NgxMatRequiredDirective implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() validateProperty: any = {};

  @Input() model: any;

  @Input() policy: string;

  parentNodeName = '';
  depthOfParentNode: number;
  isInput = false;
  isCheckbox = false;
  isRadioButton = false;

  private ngModelValueChangesSubscription: Subscription;

  constructor(
    private validationService: NgxValidationRunnerService,
    private elementRef: ElementRef, private ngZone: NgZone,
    private renderer2: Renderer2, private ngModel: NgModel) {

  }


  ngOnInit(): void {
    /**
     * add message event listener
     * message shall come from component validator directive
     */
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    this.ngZone.runOutsideAngular(() => {


      window.addEventListener("message", (event: MessageEvent) => {

        if (event.data.type === 'required' && event.data.propertyName === this.validateProperty) {
          // debugger;
          this.addAsteriskToMatControl(event.data.operation === 'added' ? event.data.errorMessage : null);
        }
      }, false);

    });
  }

  ngAfterViewInit() {

    this.testMatElementType();

    this.ngModelValueChangesSubscription =
      this.ngModel.valueChanges.subscribe((value) => {
        // delay to update the model
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.validationService.markForRequiredCheck(this.policy, this.model); // no need to subscribe here
          }, 200);
        });
      });

  }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO : trigger validation of whole model
  }

  ngOnDestroy(): void {
    this.ngModelValueChangesSubscription.unsubscribe();
  }

  testMatElementType() {
    const node = this.elementRef.nativeElement;

    this.depthOfParentNode = 5; // till what depth we want to search
    const classList = [...node.classList];
    const elementClass = classList.reduce((acc, value) => {

      value = value.toUpperCase();

      if (value === 'MAT-INPUT-ELEMENT' || value === 'MAT-SELECT') {
        acc.push('MAT-FORM-FIELD'); return acc;
      } else if (value === 'MAT-RADIO-INPUT' || value === 'MAT-RADIO-GROUP') {
        acc.push('MAT-RADIO-GROUP'); return acc;
      } else if (value === 'MAT-CHECKBOX-INPUT' || value === 'MAT-CHECKBOX') {
        acc.push('MAT-CHECKBOX'); return acc;
      } else {
        return acc;
      }
    }, []);

    switch (elementClass[0].toUpperCase()) {
      case 'MAT-CHECKBOX':
        this.parentNodeName = 'MAT-CHECKBOX';
        this.depthOfParentNode = 3;
        this.isCheckbox = true;
        break;
      case 'MAT-RADIO-GROUP':
        this.parentNodeName = 'MAT-RADIO-GROUP';
        this.depthOfParentNode = 3;
        this.isRadioButton = true;
        break;
      case 'MAT-FORM-FIELD':
      case 'MAT-SELECT':
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

      this.renderer2.addClass(node, 'mat-form-field');
      let errorValidationContainer = node.querySelector('.ui-validation-transitionMessages');

      if (errorValidationContainer === null) {
        errorValidationContainer = document.createElement('div');

        errorValidationContainer.className = 'ui-validation-transitionMessages';
        node.appendChild(errorValidationContainer);
      }
    }
  }

  addAsteriskToMatControl = (errorMsg: string) => {
    let node = this.elementRef.nativeElement;
    const maxDept = 5;  // mat elements parent's depth doesn't exceed 5
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
      const inputFormFieldElement = node.querySelector('.mat-form-field-label');

      if (inputFormFieldElement) {
        const spanRequiredContainer = inputFormFieldElement.querySelectorAll(".mat-placeholder-required");

        this.addAsteriskToSpanElement(spanRequiredContainer, inputFormFieldElement, errorMsg);
      }
    }

    if (this.isCheckbox) {
      const checkboxSpanElement = node.querySelector('.mat-checkbox-label');

      if (checkboxSpanElement) {
        const spanRequiredContainer = checkboxSpanElement.querySelectorAll(".mat-placeholder-required");

        this.addAsteriskToSpanElement(spanRequiredContainer, checkboxSpanElement, checkboxSpanElement);
      }
    }

    if (this.isRadioButton) {
      const matradioSpanElement = node.querySelectorAll('.mat-radio-label-content');

      if (matradioSpanElement && matradioSpanElement.length > 0) {

        matradioSpanElement.forEach(elem => {
          const spanRequiredContainer = elem.querySelectorAll(".mat-placeholder-required");

          this.addAsteriskToSpanElement(spanRequiredContainer, elem, errorMsg);
        });

      }
    }

  };

  addAsteriskToSpanElement = function (spanRequiredContainer: any, inputSpanElement: any, errorMsg: string) {
    if (spanRequiredContainer && spanRequiredContainer.length > 0) {
      spanRequiredContainer.forEach(requiredNode => {
        this.renderer2.removeChild(inputSpanElement, requiredNode);
      });
    }
    if (!!errorMsg) {
      const starSpanElement = document.createElement('span');
      const textNode = document.createTextNode(" *");
      starSpanElement.appendChild(textNode);

      this.renderer2.addClass(starSpanElement, "mat-placeholder-required");
      this.renderer2.addClass(starSpanElement, "mat-form-field-required-marker");
      this.renderer2.addClass(starSpanElement, "label-required");

      inputSpanElement.appendChild(starSpanElement);
      /**
       * label-required class controls the color of asterisk
       * add color in demo project styles.css
       * .label-required { color: red; }
       */
      // this.renderer2.addClass(inputSpanElement, "label-required");
    } else if (inputSpanElement.classList && inputSpanElement.classList.value.indexOf("label-required") > -1) {
      this.renderer2.removeClass(inputSpanElement, "label-required");
    }
  };

}