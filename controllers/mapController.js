const Map = require("../models/Map");
const User = require("../models/User");

const ERROR_MESSAGE = require("../constants");

const getMapPoints = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { members: mapPoints } = await Map.findById(id)
      .populate("members")
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
  const { map, user } = req.body;

  try {
    const currentUser = await User.findOne({ _id: user }).exec();
    const newMap = new Map(map);

    newMap.members.push(currentUser);
    currentUser.myMaps.push(newMap);

    await newMap.save();
    await currentUser.save();

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

exports.getMapPoints = getMapPoints;
exports.createNewMap = createNewMap;
