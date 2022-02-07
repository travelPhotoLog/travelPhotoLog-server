const { body, validationResult } = require("express-validator");

const ERROR_MESSAGE = require("../constants");

const signUpInputValidators = [
  body("user.email")
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGE.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(ERROR_MESSAGE.MUST_BE_EMAIL),
  body("user.nickname")
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGE.NICKNAME_REQUIRED),
  body("user.profileUrl")
    .trim()
    .isURL()
    .withMessage(ERROR_MESSAGE.PROFILE_URL_REQUIRED),
];

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    const errorObj = {};

    if (!errors.isEmpty()) {
      errors.array().forEach(error => {
        const { param: key, msg: message } = error;
        const inputName = key.split(".")[1];

        if (errorObj[inputName]) {
          return;
        }

        errorObj[inputName] = message;
      });

      errorObj.code = 400;
      res.json({ error: errorObj });
      return;
    }

    next();
  };
};

exports.signUpInputValidators = signUpInputValidators;
exports.validate = validate;
