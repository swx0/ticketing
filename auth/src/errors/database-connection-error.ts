import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  status = 500;
  reason = 'Error connecting to database';

  constructor() {
    super('db error');

    // need this line because extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
