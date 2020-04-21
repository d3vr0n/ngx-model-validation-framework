export interface NgxValidationEvent {
    type: string,
    errors: Array<NgxValidationResult>
}
export interface NgxValidationResult {
    propertyName : string;
    errorMessage : string;
}

