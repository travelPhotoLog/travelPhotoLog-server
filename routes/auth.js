const express = require("express");

const ERROR_MESSAGE = require("../constant");
const User = require("../models/User");
const checkToken = require("./middleware/tokenValidation");
const checkUser = require("./middleware/userValidation");

const router = express.Router();

router.post("/login", checkUser, checkToken, async (req, res, next) => {
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
});

router.post("/logout", async (req, res, next) => {
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
});

module.exports = router;
