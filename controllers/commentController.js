const Comment = require("../models/Comment");
const Photo = require("../models/Photo");

const ERROR_MESSAGE = require("../constants");

const addComment = async (req, res, next) => {
  const { comment, photo } = req.body;

  try {
    const newComment = new Comment(comment);
    const commentId = newComment._id;

    const currentPhoto = await Photo.findById(photo).exec();
    currentPhoto.comments.push(commentId);

    await Promise.all([newComment.save(), currentPhoto.save()]);

    res.json({ result: "ok" });
  } catch {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.addComment = addComment;
