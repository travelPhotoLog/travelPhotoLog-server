const url = require("url");

const Comment = require("../models/Comment");
const Photo = require("../models/Photo");

const { ERROR_MESSAGE } = require("../constants");

const deleteComment = async (req, res, next) => {
  const { id: commentId } = req.params;
  const { photo: photoId } = url.parse(req.url, true).query;

  try {
    const photo = await Photo.findById(photoId).exec();
    const photoComments = photo.comments;

    for (let i = 0; i < photoComments.length; i++) {
      if (photoComments[i].equals(commentId)) {
        photoComments.splice(i, 1);
        break;
      }
    }

    photo.comments = photoComments;

    await Promise.all([
      photo.save(),
      Comment.deleteOne({ _id: commentId }).exec(),
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

exports.deleteComment = deleteComment;
