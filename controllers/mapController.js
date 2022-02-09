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

exports.getMapPoints = getMapPoints;
exports.createNewMap = createNewMap;
