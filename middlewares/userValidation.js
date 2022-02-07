const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const validateUser = async (req, res, next) => {
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

const validateToken = async (req, res, next) => {
  const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;
  const { accessToken } = req.cookies;
  const user = req.body
    ? await User.findOne({ email: req.body.email }).exec()
    : await User.findById(req.params.id).exec();

  if (!accessToken) {
    const newAccessToken = jwt.sign({ email: user.email }, ACCESS_SECRET_KEY, {
      expiresIn: "1h",
    });
    const newRefreshToken = jwt.sign(
      { email: user.email },
      REFRESH_SECRET_KEY,
      {
        expiresIn: "14days",
      }
    );

    res.cookie("accessToken", newAccessToken, {
      maxAge: 3600,
      httpOnly: true,
    });

    user.refreshToken = newRefreshToken;

    try {
      await user.save();

      next();
    } catch {
      res.json({
        error: {
          message: ERROR_MESSAGE.SERVER_ERROR,
          code: 500,
        },
      });
    }
  }

  if (accessToken) {
    try {
      jwt.verify(accessToken, ACCESS_SECRET_KEY);

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decodedToken = jwt.verify(
            user.refreshToken,
            REFRESH_SECRET_KEY
          );
          const newAccessToken = jwt.sign(
            { email: decodedToken.email },
            ACCESS_SECRET_KEY,
            { expiresIn: "1h" }
          );

          res.cookie("accessToken", newAccessToken, {
            maxAge: 3600,
            httpOnly: true,
          });

          next();
        } catch (error) {
          if (error.name === "TokenExpiredError") {
            res.clearCookie("accessToken");

            user.refreshToken = "";

            try {
              await user.save();

              res.json({
                result: "재로그인이 필요한 유저입니다",
              });
            } catch {
              res.json({
                error: {
                  message: ERROR_MESSAGE.SERVER_ERROR,
                  code: 500,
                },
              });
            }
          }
        }
      }

      if (error.name === "JsonWebTokenError") {
        res.json({
          result: "해당 유저가 존재하지 않습니다",
        });
      }
    }
  }
};

exports.validateUser = validateUser;
exports.validateToken = validateToken;
