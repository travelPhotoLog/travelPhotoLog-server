const jwt = require("jsonwebtoken");

const ERROR_MESSAGE = require("../constants");

const validateInvitation = (req, res, next) => {
  const { token } = req.params;
  const { INVITATION_SECRET_KEY } = process.env;

  try {
    res.locals.userEmail = jwt.verify(token, INVITATION_SECRET_KEY).email;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.json({
        error: {
          message: ERROR_MESSAGE.FORBIDDEN,
          code: 403,
        },
      });
    }

    res.json({
      message: ERROR_MESSAGE.NOT_FOUND,
      code: 404,
    });
  }
};

exports.validateInvitation = validateInvitation;
