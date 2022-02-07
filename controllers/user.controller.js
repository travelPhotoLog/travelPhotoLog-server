const User = require("../models/User");

const getUserMaps = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userMaps = await User.findById(id).populate("myMaps").lean().exec();

    const maps = userMaps.map(map => ({
      id: map._id,
      title: map.title,
    }));

    res.json({ maps });
  } catch (error) {
    res.json({
      error: {
        message: "Server is not stable",
        status: 500,
      },
    });
  }
};

exports.getUserMaps = getUserMaps;
