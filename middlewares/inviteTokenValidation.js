const jwt = require("jsonwebtoken");
const Map = require("../models/Map");

const { ERROR_MESSAGE } = require("../constants");

const { INVITATION_SECRET_KEY } = process.env;

const validateInviteToken = async (req, res, next) => {
  const { id } = req.params;

  try {
    const currentMap = await Map.findById(id).exec();

    const verifyToken = token => {
      try {
        return jwt.verify(token, INVITATION_SECRET_KEY).hasOwnProperty("email");
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
  } catch (error) {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.validateInviteToken = validateInviteToken;
