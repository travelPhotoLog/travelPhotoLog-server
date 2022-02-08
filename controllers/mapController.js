const Map = require("../models/Map");
const ERROR_MESSAGE = require("../constants");

const getmapPoints = async (req, res, next) => {
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

exports.getmapPoints = getmapPoints;
