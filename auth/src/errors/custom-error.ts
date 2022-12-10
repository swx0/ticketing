export abstract class CustomError extends Error {
  abstract status: number;

  constructor(message: string) {
    super(message);

    // need this line because extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
