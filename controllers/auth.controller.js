const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const postLogin = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

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
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
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
