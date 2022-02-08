const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const postLogin = async (req, res, next) => {
  const { accessToken } = req.cookies;
  const { newAccessToken, newRefreshToken } = req;
  const { ACCESS_SECRET_KEY } = process.env;
  const { email } = accessToken
    ? jwt.verify(accessToken, ACCESS_SECRET_KEY, { ignoreExpiration: true })
    : jwt.verify(newAccessToken, ACCESS_SECRET_KEY);

  try {
    const user = await User.findOne({ email }).exec();

    if (newAccessToken) {
      res.cookie("accessToken", newAccessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });
    }

    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
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

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

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

    res.send({ result: "ok" });
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
