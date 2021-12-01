class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequest) {
      return 400;
    }
    if (this instanceof UnAuthorized) {
      return 401;
    }
    if (this instanceof IsExist) {
      return 403;
    }
    if (this instanceof IsNotExists) {
      return 403;
    }
    if (this instanceof NotFound) {
      return 404;
    }
    return 500;
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class UnAuthorized extends GeneralError {}
class IsExist extends GeneralError {}
class IsNotExists extends GeneralError {}

module.exports = {
  GeneralError,
  BadRequest,
  NotFound,
  UnAuthorized,
  IsExist,
  IsNotExists,
};
