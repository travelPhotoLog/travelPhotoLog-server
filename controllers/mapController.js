const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("../models/Point");
const Map = require("../models/Map");
const User = require("../models/User");

const { ERROR_MESSAGE, RESPONSE_MESSAGE } = require("../constants");

const { INVITATION_SECRET_KEY, INVITATION_MAIL, INVITATION_PASSWORD } =
  process.env;

const getMapPhotos = async (req, res, next) => {
  const { id } = req.params;
  const { newAccessToken, newRefreshToken } = res.locals;

  try {
    const { photos: mapPhotos } = await Map.findById(id)
      .populate("photos", "url date")
      .lean()
      .exec();

    const photos = mapPhotos
      .sort((a, b) => b.date - a.date)
      .map(photo => photo.url);

    if (newRefreshToken) {
      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        photos,
      });

      return;
    }

    if (newAccessToken) {
      res.json({
        accessToken: newAccessToken,
        photos,
      });

      return;
    }

    res.json({ photos });
  } catch (error) {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const getMapPoints = async (req, res, next) => {
  const { id } = req.params;
  const { newAccessToken, newRefreshToken } = res.locals;

  try {
    const { points: mapPoints } = await Map.findById(id)
      .populate("points")
      .lean()
      .exec();

    if (newRefreshToken) {
      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        mapPoints,
      });

      return;
    }

    if (newAccessToken) {
      res.json({
        accessToken: newAccessToken,
        mapPoints,
      });

      return;
    }

    res.json({ mapPoints });
  } catch {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const createNewMap = async (req, res, next) => {
  const { map, user: id } = req.body;
  const { newAccessToken, newRefreshToken } = res.locals;

  try {
    const currentUser = await User.findById(id).exec();
    const newMap = new Map(map);

    newMap.members.push(currentUser);
    currentUser.myMaps.push(newMap);

    await Promise.all([newMap.save(), currentUser.save()]);

    if (newRefreshToken) {
      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        result: "ok",
      });

      return;
    }

    if (newAccessToken) {
      res.json({
        accessToken: newAccessToken,
        result: "ok",
      });

      return;
    }

    res.json({
      result: "ok",
    });
  } catch (error) {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const getMembers = async (req, res, next) => {
  const { id } = req.params;
  const { newAccessToken, newRefreshToken } = res.locals;

  try {
    const { members: memberList } = await Map.findById(id)
      .populate("members")
      .lean()
      .exec();

    const members = memberList.map(member => {
      return {
        profileUrl: member.profileUrl,
        nickname: member.nickname,
      };
    });

    if (newRefreshToken) {
      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        members,
      });

      return;
    }

    if (newAccessToken) {
      res.json({
        accessToken: newAccessToken,
        members,
      });

      return;
    }

    res.json({ members });
  } catch {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const addInvitedUser = async (req, res, next) => {
  const { id } = req.params;
  const { userEmail } = res.locals;
  const { newAccessToken, newRefreshToken } = res.locals;

  try {
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { myMaps: id } }
    ).exec();
    const map = await Map.findById(id).exec();

    map.members.push(user._id);

    const { invitationList } = map;
    const removedUserIndex = invitationList
      .map(user => user.email)
      .indexOf(userEmail);

    invitationList.splice(removedUserIndex, 1);

    await map.save();

    if (newRefreshToken) {
      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        result: "ok",
      });

      return;
    }

    if (newAccessToken) {
      res.json({
        accessToken: newAccessToken,
        result: "ok",
      });

      return;
    }

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

const inviteNewMember = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const currentMap = await Map.findById(id).exec();
    const invitedUser = await User.findOne({ email }).exec();

    if (!invitedUser) {
      res.json({
        result: ERROR_MESSAGE.NOT_VALID_USER,
      });

      return;
    }

    const userId = invitedUser._id;
    const isInvitedEmail = currentMap.invitationList
      .map(user => user.email)
      .includes(email);

    if (currentMap.members.includes(userId)) {
      res.json({
        result: RESPONSE_MESSAGE.ALREADY_IN_SAME_GROUP,
      });

      return;
    }

    if (isInvitedEmail) {
      res.json({
        result: RESPONSE_MESSAGE.ALREADY_INVITED,
      });

      return;
    }

    const invitationToken = jwt.sign({ email }, INVITATION_SECRET_KEY, {
      expiresIn: "2d",
    });

    const invitationUrl = `http://localhost:3000/my-travels/${id}/invitation/${invitationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: INVITATION_MAIL,
        pass: INVITATION_PASSWORD,
      },
    });

    const mailOption = {
      from: INVITATION_MAIL,
      to: email,
      subject: "[OCN] ?????? ?????? ??????",
      html: `<p> ?????? ????????? ????????? ???????????? ?????? ????????? </p> <a href=${invitationUrl} >????????????</a>`,
    };

    currentMap.invitationList.push({
      email,
      token: invitationToken,
    });

    await Promise.all([transporter.sendMail(mailOption), currentMap.save()]);

    res.json({
      result: RESPONSE_MESSAGE.SENDING_SUCCESS,
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

exports.getMapPhotos = getMapPhotos;
exports.getMapPoints = getMapPoints;
exports.createNewMap = createNewMap;
exports.getMembers = getMembers;
exports.addInvitedUser = addInvitedUser;
exports.inviteNewMember = inviteNewMember;
