const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const { ACCESS_SECRET_KEY } = process.env;

const validateMember = async (req, res, next) => {
  const { id } = req.params;

  const { accessToken } = req.cookies;
  const { newAccessToken } = res.locals;

  const { email } = newAccessToken
    ? jwt.verify(newAccessToken, ACCESS_SECRET_KEY)
    : jwt.verify(accessToken, ACCESS_SECRET_KEY);

  try {
    const { myMaps: userMaps } = await User.findOne({ email })
      .populate("myMaps")
      .lean()
      .exec();

    const existMap = userMaps.find(map => map._id === id);

    if (existMap) {
      next();
    }

    res.json({
      error: {
        message: ERROR_MESSAGE.FORBIDDEN,
        code: 403,
      },
    });
  } catch {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.validateMember = validateMember;
