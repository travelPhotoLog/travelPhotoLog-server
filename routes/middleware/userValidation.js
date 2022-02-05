const MESSAGE = require("../../constant");
const User = require("../../models/User");

const checkUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.json({
        result: "해당 유저가 존재하지 않습니다."
      });
    }

    next();
  } catch {
    res.json({
      error: {
        message: MESSAGE.SERVER_ERROR,
        code: 500
      }
    });
  }
};

module.exports = checkUser;
