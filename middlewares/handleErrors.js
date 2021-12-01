const { GeneralError } = require("../utils/errors");

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: err.getCode(),
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 500,
    message: err.message,
  });
};

module.exports = handleErrors;
