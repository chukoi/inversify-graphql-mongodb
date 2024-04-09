export class NotFoundError extends Error {
  constructor(m: string = "Not found") {
    super(m);

    // set the prototype explicitly.
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends Error {
  public errorMessage: any;

  constructor(error: any) {
    super(error);
    this.errorMessage = error;
    // set the prototype explicitly.
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
