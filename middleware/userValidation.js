const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const checkUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.json({
        result: "해당 유저가 존재하지 않습니다",
      });

      return;
    }

    next();
  } catch {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

module.exports = checkUser;
