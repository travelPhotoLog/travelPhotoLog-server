const url = require("url");

require("../models/Photo");
const Point = require("../models/Point");
const { ERROR_MESSAGE } = require("../constants");

const getPhotos = async (req, res, next) => {
  const { latitude, logitude } = url.parse(req.url, true).query;

  try {
    const { photos: dbPhotos } = await Point.findOne({ latitude }, { logitude })
      .populate("photos", "_id createdAt url description")
      .lean()
      .exec();

    const photos = dbPhotos.map(({ _id: id, createdAt, url, description }) => ({
      id,
      createdAt,
      url,
      description,
    }));

    res.json({ photos });
  } catch {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.getPhotos = getPhotos;
