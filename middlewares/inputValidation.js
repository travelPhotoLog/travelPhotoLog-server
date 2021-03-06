const { body, validationResult } = require("express-validator");

const { ERROR_MESSAGE } = require("../constants");

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

const commentInputValidator = [
  body("comment.message")
    .exists()
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGE.MESSAGE_REQUIRED)
    .isLength({ max: 50 })
    .withMessage(ERROR_MESSAGE.LENGTH_LIMIT),
];

const pointValidators = [
  body("point.latitude")
    .exists()
    .isFloat({ min: -90, max: 90 })
    .withMessage(ERROR_MESSAGE.MUST_BE_IN_LIMIT),
  body("point.longitude")
    .exists()
    .isFloat({ min: -90, max: 90 })
    .withMessage(ERROR_MESSAGE.MUST_BE_IN_LIMIT),
  body("point.placeName")
    .exists()
    .withMessage(ERROR_MESSAGE.PLACENAME_REQUIRED),
  body("point.photos")
    .exists()
    .isLength({ min: 1, max: undefined })
    .withMessage(ERROR_MESSAGE.PHOTO_REQUIRED),
];

const photoValidators = [
  body("photo").isJSON().withMessage(ERROR_MESSAGE.BAD_REQUEST),
];

const postingInputValidators = [
  body("posting.title")
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGE.TITLE_REQUIRED),
  body("posting.content")
    .exists()
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGE.MESSAGE_REQUIRED),
  body("posting.hashtags")
    .exists()
    .isArray({ min: 1, max: 5 })
    .withMessage(ERROR_MESSAGE.HASHTAGS_COUNT_LIMIT),
  body("posting.regions")
    .exists()
    .isArray({ min: 1, max: 3 })
    .withMessage(ERROR_MESSAGE.REGIONS_COUNT_LIMIT),
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

exports.commentInputValidator = commentInputValidator;
exports.signUpInputValidators = signUpInputValidators;
exports.pointValidators = pointValidators;
exports.photoValidators = photoValidators;
exports.postingInputValidators = postingInputValidators;
exports.validate = validate;
