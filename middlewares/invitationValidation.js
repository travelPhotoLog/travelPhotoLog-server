const jwt = require("jsonwebtoken");

const Map = require("../models/Map");
const { ERROR_MESSAGE } = require("../constants");

const validateInvitation = (req, res, next) => {
  const { token } = req.params;
  const { INVITATION_SECRET_KEY } = process.env;

  try {
    res.locals.userEmail = jwt.verify(token, INVITATION_SECRET_KEY).email;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.json({
        error: {
          message: ERROR_MESSAGE.FORBIDDEN,
          code: 403,
        },
      });
    }

    res.json({
      message: ERROR_MESSAGE.NOT_FOUND,
      code: 404,
    });
  }
};

const validateInviteToken = async (req, res, next) => {
  const { id } = req.params;
  const { INVITATION_SECRET_KEY } = process.env;

  try {
    const currentMap = await Map.findById(id).exec();

    const verifyToken = token => {
      try {
        return jwt.verify(token, INVITATION_SECRET_KEY);
      } catch {
        return false;
      }
    };

    const filteredInvitationList = currentMap.invitationList.filter(item =>
      verifyToken(item.token)
    );

    currentMap.set("invitationList", filteredInvitationList);
    await currentMap.save();

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

exports.validateInvitation = validateInvitation;
exports.validateInviteToken = validateInviteToken;
