const Map = require("../models/Map");
const User = require("../models/User");

const ERROR_MESSAGE = require("../constants");

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

exports.getMapPoints = getMapPoints;
exports.createNewMap = createNewMap;
exports.getMembers = getMembers;
exports.addInvitedUser = addInvitedUser;
