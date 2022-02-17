const express = require("express");

const { validateId } = require("../middlewares/objectIdValidation");
const commentController = require("../controllers/commentController");
const {
  validate,
  commentInputValidator,
} = require("../middlewares/inputValidation");

const router = express.Router();

router.post(
  "/new",
  validate(commentInputValidator),
  commentController.addComment
);
router.delete("/:id", validateId, commentController.deleteComment);

module.exports = router;
