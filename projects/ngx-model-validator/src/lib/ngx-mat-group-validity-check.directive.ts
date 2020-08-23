import {
  AfterViewInit, Directive, OnInit, Renderer2, ElementRef, OnDestroy, Input, OnChanges, SimpleChanges, NgZone, Output, EventEmitter
} from '@angular/core';


// usage    
// <div ngxBootStrapValidate="group-1" (groupValidationStatusChange)="groupValidationStatusChangeHandler($event)" >

@Directive({
  selector: '[ngxMatGroupValidityCheck]'
})
export class NgxMatGroupValidityCheckDirective implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  private mutationObserver: MutationObserver;
  private _requiredStarCount = 0; // goes +ve
  private _validationMatErrorCount = 0; // goes -ve
  private _ngPristineClassCount = 0; //goes +ve
  private _ngValidClassCount = 0; //goes -ve

  @Input('ngxMatGroupValidityCheck') groupName : string;
  @Output() groupValidationStatusChange = new EventEmitter();


  constructor(
    private elementRef: ElementRef) {
  }


  ngOnInit(): void { }

  ngAfterViewInit() {

    // Select the node that will be observed for mutations
    const targetNode = this.elementRef.nativeElement;// document.getElementById('myForm');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Create an observer instance linked to the callback function
    this.mutationObserver = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          
          if (mutation.addedNodes.length === 1 && (<any>mutation.addedNodes[0]).tagName === 'SPAN') {
            if ((<any>mutation.addedNodes[0]).innerHTML.trim() === "*") {
              this._requiredStarCount++;
            } else {
            // something else found
              // console.error(mutation.addedNodes[0]);
            }
          } else if (mutation.addedNodes.length === 1 && (<any>mutation.addedNodes[0]).tagName === 'MAT-ERROR') {

              // this._validationMatErrorCount++;
            
          } else if (mutation.removedNodes.length === 1 && (<any>mutation.removedNodes[0]).tagName === 'SPAN') {
            if ((<any>mutation.removedNodes[0]).innerHTML.trim() === "*") {
              this._requiredStarCount--;
            }
          } else if (mutation.removedNodes.length === 1 && (<any>mutation.removedNodes[0]).tagName === 'MAT-ERROR') {

              this._validationMatErrorCount--;
          }
          // console.log(`Required Star Count >> ${this._requiredStarCount}`);
        }
        else if (mutation.type === 'attributes' && mutation.attributeName === 'class' && (<HTMLElement>mutation.target).tagName ===  'MAT-FORM-FIELD') {
          const classList = (<HTMLElement>mutation.target).classList;
          if(classList.contains('ng-untouched') && !classList.contains('mat-focused')) {
            this._ngPristineClassCount++;
          } else if(classList.contains('mat-form-field-invalid') && !classList.contains('mat-focused')) {
            this._ngValidClassCount--;
          } else if(classList.contains('ng-dirty') && !classList.contains('mat-focused') && !classList.contains('mat-form-field-invalid')) {
            this._ngValidClassCount = this.elementRef.nativeElement.querySelectorAll('mat-form-field.ng-dirty').length;
            // this._ngValidClassCount++;
          }
          // console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
      }

      // check for any error left
      if((this._requiredStarCount + this._validationMatErrorCount === 0) || (this._ngPristineClassCount + this._validationMatErrorCount === 0) ||
        (this._ngPristineClassCount === this._ngValidClassCount)) {
        console.info('No validation error');
        this.groupValidationStatusChange.emit({ section : this.groupName || 'section', isValid :  'valid'});
      } else {
        console.info('Validation error found');
        this.groupValidationStatusChange.emit({ section : this.groupName || 'section', isValid :  'invalid'});
      }
    });

    // Start observing the target node for configured mutations
    this.mutationObserver.observe(targetNode, config);
  }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnDestroy(): void {
    this.mutationObserver.disconnect();
  }

}