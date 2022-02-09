const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Map = require("../models/Map");
const User = require("../models/User");

const ERROR_MESSAGE = require("../constants");

const { INVITATION_MAIL, INVITATION_PASSWORD } = process.env;

const getMapPoints = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { points: mapPoints } = await Map.findById(id)
      .populate("points")
      .lean()
      .exec();

    res.json({ mapPoints });
  } catch (error) {
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

  try {
    const currentUser = await User.findById(id).exec();
    const newMap = new Map(map);

    newMap.members.push(currentUser);
    currentUser.myMaps.push(newMap);

    await Promise.all([newMap.save(), currentUser.save()]);

    res.json({ result: "ok" });
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

    res.json({
      members,
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

const addInvitedUser = async (req, res, next) => {
  const { id } = req.params;
  const { userEmail } = res.locals;

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
    const newUser = await User.findOne({ email }).exec();

    const userId = newUser._id;
    const verifyInvitedEmail = currentMap.invitationList
      .map(user => user.email)
      .some(invitedEmail => invitedEmail === email);

    if (!newUser) {
      res.json({
        result: "등록되지 않은 유저입니다.",
      });
      return;
    }

    if (currentMap.members.some(member => member.equals(userId))) {
      res.json({
        result: "이미 같은 그룹 멤버입니다.",
      });
      return;
    }

    if (verifyInvitedEmail) {
      res.json({
        result: "이미 초대 메일을 보낸 유저입니다.",
      });
      return;
    }

    const invitationToken = jwt.sign(
      { email },
      process.env.INVITATION_SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );

    const invitationUrl = `http://localhost:3000/my-travels/${id}/invitation/${invitationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: INVITATION_MAIL,
        pass: INVITATION_PASSWORD,
      },
    });

    const sendMail = transporter.sendMail({
      from: INVITATION_MAIL,
      to: email,
      subject: "[OCN] 그룹 초대 메일",
      html: `<p> 아래 링크를 누르면 그룹으로 초대 됩니다 </p> <a href=${invitationUrl} >초대링크</a>`,
    });

    currentMap.invitationList.push({
      email,
      token: invitationToken,
    });

    await Promise.all([sendMail, currentMap.save()]);

    res.json({
      result: "메일 발송 성공",
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

exports.getMapPoints = getMapPoints;
exports.createNewMap = createNewMap;
exports.getMembers = getMembers;
exports.addInvitedUser = addInvitedUser;
exports.inviteNewMember = inviteNewMember;
