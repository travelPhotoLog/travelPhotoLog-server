const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const getUserMaps = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { myMaps: userMaps } = await User.findById(id)
      .populate("myMaps")
      .lean()
      .exec();

    const maps = userMaps.map(map => ({
      id: map._id,
      title: map.title,
    }));

    res.json({ maps });
  } catch (error) {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.getUserMaps = getUserMaps;
