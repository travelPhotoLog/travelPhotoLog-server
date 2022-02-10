require("../models/Photo");
const Point = require("../models/Point");
const { ERROR_MESSAGE } = require("../constants");

const getPhotos = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { photos } = await Point.findById({ _id: id })
      .populate("photos", "_id createdAt url description")
      .lean()
      .exec();

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

exports.getPhotos = getPhotos;
