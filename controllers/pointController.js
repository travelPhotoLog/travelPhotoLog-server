require("../models/Photo");

const Map = require("../models/Map");
const Point = require("../models/Point");
const { ERROR_MESSAGE } = require("../constants");

const getPhotos = async (req, res, next) => {
  const { latitude, longitude, map: mapId } = req.query;

  try {
    const { points } = await Map.findById(mapId).populate("points").exec();

    if (!points.length) {
      res.json({ photos: [] });
      return;
    }

    const point = points.find(
      point =>
        point.latitude === parseFloat(latitude) &&
        point.longitude === parseFloat(longitude)
    );

    if (!point) {
      res.json({ photos: [] });
      return;
    }

    const { photos: dbPhotos } = await Point.findById(point._id)
      .populate({
        path: "photos",
        populate: { path: "comments", model: "Comment" },
      })
      .select({ photos: 1 })
      .lean()
      .exec();

    const photos = dbPhotos
      .map(
        ({
          _id: id,
          date,
          createdBy,
          url,
          placeName,
          description,
          comments,
        }) => ({
          id,
          date,
          createdBy,
          url,
          placeName,
          description,
          comments,
        })
      )
      .sort((a, b) => b.date - a.date);

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
