import { CustomError } from './custom-error';

export class NotAuthorisedError extends CustomError {
  status = 401;

  constructor() {
    super('Not authorised');

    // need this line because extending a built in class
    Object.setPrototypeOf(this, NotAuthorisedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorised' }];
  }
}
