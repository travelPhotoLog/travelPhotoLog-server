const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const validateUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      res.json({
        result: ERROR_MESSAGE.NOT_VALID_USER,
      });

      return;
    }

    res.locals.user = user;
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
  const { accessToken, refreshToken } = req.cookies;
  const { user } = res.locals;

  if (!accessToken && user) {
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

    res.locals.newAccessToken = newAccessToken;

    res.cookie("accessToken", newAccessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    });

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    user.refreshToken = newRefreshToken;

    try {
      await user.save();

      next();
    } catch (error) {
      res.json({
        error: {
          message: ERROR_MESSAGE.SERVER_ERROR,
          code: 500,
        },
      });
    }

    return;
  }

  try {
    jwt.verify(accessToken, ACCESS_SECRET_KEY);

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        const decodedToken = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const newAccessToken = jwt.sign(
          { email: decodedToken.email },
          ACCESS_SECRET_KEY,
          { expiresIn: "1h" }
        );

        res.locals.newAccessToken = newAccessToken;

        res.cookie("accessToken", newAccessToken, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        });

        next();
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          try {
            await User.findOneAndUpdate(
              { refreshToken },
              { refreshToken: "" }
            ).exec();

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            res.json({
              message: ERROR_MESSAGE.RELOGIN_NEEDED,
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

    res.json({
      error: {
        message: ERROR_MESSAGE.UNAUTHORIZED,
        code: 401,
      },
    });
  }
};

exports.validateUser = validateUser;
exports.validateToken = validateToken;
