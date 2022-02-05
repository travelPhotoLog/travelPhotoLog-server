const jwt = require("jsonwebtoken");

const MESSAGE = require("../../constant");
const User = require("../../models/User");

const checkToken = async (req, res, next) => {
  const { ACCESS_KEY, REFRESH_KEY } = process.env;
  const { accessToken } = req.cookies;
  const user = req.body
    ? await User.findOne({ email: req.body.email }).exec()
    : await User.findById(req.params.id).exec();

  if (!accessToken) {
    const newAccessToken = jwt.sign({ email: user.email }, ACCESS_KEY, {
      expiresIn: "1h"
    });
    const newRefreshToken = jwt.sign({ email: user.email }, REFRESH_KEY, {
      expiresIn: "14days"
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true
    });

    user.refreshToken = newRefreshToken;

    try {
      await user.save();

      return next();
    } catch {
      return res.json({
        error: {
          message: MESSAGE.SERVER_ERROR,
          code: 500
        }
      });
    }
  }

  if (accessToken) {
    try {
      jwt.verify(accessToken, ACCESS_KEY);

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decodedToken = jwt.verify(user.refreshToken, REFRESH_KEY);
          const newAccessToken = jwt.sign(
            { email: decodedToken.email },
            ACCESS_KEY,
            { expiresIn: "1h" }
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true
          });

          next();
        } catch (error) {
          if (error.name === "TokenExpiredError") {
            res.clearCookie("accessToken");

            user.refreshToken = "";

            try {
              await user.save();
            } catch {
              return res.json({
                error: {
                  message: MESSAGE.SERVER_ERROR,
                  code: 500
                }
              });
            }

            res.json({
              result: "재로그인이 필요한 유저입니다."
            });
          }
        }
      }

      if (error.name === "JsonWebTokenError") {
        res.json({
          abc: 111,
          result: "해당 유저가 존재하지 않습니다."
        });
      }
    }
  }
};

module.exports = checkToken;
