const url = require("url");

const Photo = require("../models/Photo");
const Point = require("../models/Point");
const { ERROR_MESSAGE } = require("../constants");

const deletePhoto = async (req, res, next) => {
  const { id: photoId } = req.params;
  const { point: pointId } = url.parse(req.url, true).query;

  try {
    const point = await Point.findById(pointId).exec();

    const pointPhotos = point.photos;

    if (pointPhotos.length === 1) {
      await Point.deleteOne({ _id: pointId }).exec();
    } else {
      for (let i = 0; i < pointPhotos.length; i++) {
        if (pointPhotos[i].equals(photoId)) {
          pointPhotos.splice(i, 1);
          break;
        }
      }

      point.photos = pointPhotos;

      await Photo.deleteOne({ _id: photoId }).exec();
      await point.save();
    }

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

const uploadPhoto = (req, res, next) => {};

exports.deletePhoto = deletePhoto;
exports.uploadPhoto = uploadPhoto;
