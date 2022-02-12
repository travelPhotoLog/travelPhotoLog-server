const url = require("url");

const Photo = require("../models/Photo");
const Point = require("../models/Point");
const Map = require("../models/Map");

const { ERROR_MESSAGE } = require("../constants");

const uploadPhoto = async (req, res, next) => {
  const photo = JSON.parse(req.body.photo);
  const { createdAt, createdBy } = photo;
  const { description } = req.body;

  const point = JSON.parse(req.body.point);
  const { latitude, longitude, placeName } = point;

  const { map } = req.body;

  try {
    const currentPoint = await Point.findOne({ latitude, longitude }).exec();
    const currentMap = await Map.findById(map).exec();
    const newPhoto = new Photo({
      createdAt,
      createdBy,
      url: req.file.location,
      placeName,
      description,
    });

    if (currentPoint) {
      const currentPointId = currentPoint._id;
      const newPhotoId = newPhoto._id;

      currentPoint.photos.push(newPhotoId);
      newPhoto.point = currentPointId;
      currentMap.photos.push(newPhotoId);

      await Promise.all([
        newPhoto.save(),
        currentPoint.save(),
        currentMap.save(),
      ]);

      res.json({
        result: "ok",
      });
    }

    if (!currentPoint) {
      const newPoint = await Point.create(point);
      const newPointId = newPoint._id;
      const newPhotoId = newPhoto._id;

      currentMap.points.push(newPointId);
      currentMap.photos.push(newPhotoId);
      newPoint.photos.push(newPhotoId);
      newPhoto.point = newPointId;

      await Promise.all([newPhoto.save(), newPoint.save(), currentMap.save()]);

      res.json({
        pointId: newPointId,
      });
    }
  } catch {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

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

exports.uploadPhoto = uploadPhoto;
exports.deletePhoto = deletePhoto;
