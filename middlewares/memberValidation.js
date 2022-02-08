const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const { ACCESS_SECRET_KEY } = process.env;

const validateMember = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { accessToken } = req.cookies;
    const { newAccessToken } = res.locals;

    const { email } = newAccessToken
      ? jwt.verify(newAccessToken, ACCESS_SECRET_KEY)
      : jwt.verify(accessToken, ACCESS_SECRET_KEY);

    try {
      const { myMaps: userMaps } = await User.findOne({ email }).lean().exec();

      if (userMaps.includes(id)) {
        next();
      }

      res.json({
        result: ERROR_MESSAGE.NOT_VALID_URL,
      });
    } catch (error) {
      res.json({
        result: ERROR_MESSAGE.NOT_VALID_URL,
      });
    }
  } catch (error) {
    res.json({
      result: ERROR_MESSAGE.NOT_VALID_URL,
    });
  }
};

exports.validateMember = validateMember;
