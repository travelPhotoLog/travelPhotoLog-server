const Photo = require("../models/Photo");
const Point = require("../models/Point");
const Map = require("../models/Map");
const Comment = require("../models/Comment");

const { ERROR_MESSAGE } = require("../constants");

const uploadPhoto = async (req, res, next) => {
  const { photo, point, map } = req.body;
  const { date, createdBy, description } = JSON.parse(photo);
  const { latitude, longitude, placeName } = JSON.parse(point);

  try {
    const [currentPoint, currentMap] = await Promise.all([
      Point.findOne({ latitude, longitude }).exec(),
      Map.findById(map).exec(),
    ]);
    const newPhoto = new Photo({
      date,
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
      const newPoint = await Point.create({
        latitude,
        longitude,
        placeName,
      });

      const newPointId = newPoint._id;
      const newPhotoId = newPhoto._id;

      currentMap.points.push(newPointId);
      currentMap.photos.push(newPhotoId);
      newPoint.photos.push(newPhotoId);
      newPhoto.point = newPointId;

      await Promise.all([newPhoto.save(), newPoint.save(), currentMap.save()]);

      res.json({
        result: "ok",
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
  const { map: mapId } = req.query;

  try {
    const currentMap = await Map.findById(mapId).exec();
    const currentPhoto = await Photo.findById(photoId)
      .populate("comments")
      .exec();

    const { points: pointsInMap, photos: photosInMap } = currentMap;
    const { comments, point: pointInPhoto } = currentPhoto;
    const currentPoint = await Point.findById(pointInPhoto);
    const { photos: photosInPoint } = currentPoint;

    const deleteCommentFn = async commentId => {
      await Comment.deleteOne({ _id: commentId });
    };

    for (let i = 0; i < comments.length; i++) {
      deleteCommentFn(comments[i]._id);
    }

    const newPhotosArray = photosInMap.filter(
      photoInMap => photoInMap.toString() !== photoId
    );

    currentMap.photos = newPhotosArray;

    if (photosInPoint.length === 1) {
      const newPointsArray = pointsInMap.filter(pointInMap => {
        return pointInMap.toString() !== pointInPhoto.toString();
      });

      currentMap.points = newPointsArray;

      await Promise.all([
        Photo.deleteOne({ _id: photoId }),
        Point.deleteOne({ _id: pointInPhoto }),
        currentMap.save(),
      ]);

      res.json({
        result: "ok",
      });

      return;
    }

    const newPhotosInPointArray = photosInPoint.filter(
      photoInPoint => photoInPoint.toString() !== photoId
    );

    currentPoint.photos = newPhotosInPointArray;

    await Promise.all([
      Photo.deleteOne({ _id: photoId }),
      currentPoint.save(),
      currentMap.save(),
    ]);

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
