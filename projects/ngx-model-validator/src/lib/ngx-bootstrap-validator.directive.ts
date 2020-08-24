import {
  AfterViewInit, Directive, OnInit, Renderer2, ElementRef, OnDestroy, Input, OnChanges, SimpleChanges, NgZone, Inject
} from '@angular/core';

import { NgxValidationRunnerService } from './service/ngx-validation-runner.service';
import { NgModel } from '@angular/forms';
import { WINDOW } from './util/window-ref';


// TODO : abstract the validation logic in a base class and use it in a child class for
// any type of UI, e.g. material, bootstrap etc.
// usage    
//   ngxBootStrapValidate [validateProperty]="person.age" [model]="person" [policy]="PERSON_POLICY_NAME" [(ngModel)]="person.age"

// try follow https://github.com/rsaenen/ngx-custom-validators/blob/master/src/app/less-than/directive.ts

@Directive({
  selector: '[ngModel][ngxBootStrapValidate]',
  // providers: [NgModel]
})
export class NgxBootStrapValidatorDirective implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() validateProperty: any = {};

  @Input() model: any;

  @Input() policy: string;

  @Input() validateOnEvent: string;

  immediateParentNode: any;
  formGroupContainerDiv: any;
  isInput = false;
  isCheckbox = false;
  isRadioButton = false;

  constructor(
    private validationService: NgxValidationRunnerService,
    private elementRef: ElementRef, private ngZone: NgZone,
    private renderer2: Renderer2, @Inject(WINDOW) private _window: any) {

  }


  ngOnInit(): void {
    /**
     * add message event listener
     * message shall come from component validator directive
     */
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
    this._window.addEventListener("message", (event: MessageEvent) => {

      if (event.data.type === 'validation' && event.data.propertyName === this.validateProperty) {
        
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
      const delay = (this.isRadioButton || this.isCheckbox) ? 200 : 0;
      // run validation after the delay

      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.validationService.validate(this.policy, this.model, this.validateProperty); // no need to subscribe here
        }, delay);
      });
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO : trigger validation of whole model
  }

  ngOnDestroy(): void {

  }

  testBootstrapElementType() {
    const node = this.elementRef.nativeElement;
    
    if(node.type === 'text') {
      this.isInput = true;
      this.immediateParentNode = node.parentNode;
      this.formGroupContainerDiv = this.immediateParentNode.parentNode;
    } else if(node.type === 'radio') {
      this.isRadioButton = true;
      this.immediateParentNode = node.parentNode.parentNode;
      this.formGroupContainerDiv = this.immediateParentNode.parentNode;
    }
    
  }

  addErrorToBootstrapControl(errorMsg: string) {
    // let node = this.elementRef.nativeElement;
    this.ngZone.run(() => {
      if(errorMsg) {
        if(this.isRadioButton && this.formGroupContainerDiv.className.indexOf('border') > -1) {
          return;
        }
        this.renderer2.addClass(this.formGroupContainerDiv, 'border');
        this.renderer2.addClass(this.formGroupContainerDiv, 'border-danger');

        const errorHolder = document.createElement('span');
        const textNode = document.createTextNode(errorMsg);
        errorHolder.appendChild(textNode);
        this.immediateParentNode.appendChild(errorHolder);
        
      } else {
        this.renderer2.removeClass(this.formGroupContainerDiv, 'border');
        this.renderer2.removeClass(this.formGroupContainerDiv, 'border-danger');
        const errorTextNode = this.immediateParentNode.lastChild;
        if(errorTextNode.tagName === 'SPAN') {
          this.immediateParentNode.removeChild(errorTextNode);
        }
      }
    });
  };

}