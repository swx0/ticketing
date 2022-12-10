import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  status = 404;

  constructor() {
    super('Route not found');

    // need this line because extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}
