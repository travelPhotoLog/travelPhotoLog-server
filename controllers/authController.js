const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { ERROR_MESSAGE } = require("../constants");

const postLogin = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const { newAccessToken, newRefreshToken } = res.locals;
  const { ACCESS_SECRET_KEY } = process.env;
  const { email } = newAccessToken
    ? jwt.verify(newAccessToken, ACCESS_SECRET_KEY)
    : jwt.verify(accessToken, ACCESS_SECRET_KEY);

  try {
    const user = await User.findOne({ email }).exec();

    if (newRefreshToken) {
      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user._id,
          email: user.email,
          nickname: user.nickname,
        },
      });

      return;
    }

    if (newAccessToken) {
      res.json({
        accessToken: newAccessToken,
        user: {
          id: user._id,
          email: user.email,
          nickname: user.nickname,
        },
      });

      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
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

const postLogout = async (req, res, next) => {
  const { email } = req.body;

  try {
    await User.findOneAndUpdate({ email }, { refreshToken: "" }).exec();

    res.json({
      result: "ok",
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

const postSignUp = async (req, res, next) => {
  const { user } = req.body;

  try {
    await User.create(user);

    res.json({
      result: "ok",
    });
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      res.json({
        result: ERROR_MESSAGE.DUPLICATE_KEY_ERROR,
      });

      return;
    }

    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.postSignUp = postSignUp;
