const express = require("express");

const { validateId } = require("../middlewares/objectIdValidation");
const commentController = require("../controllers/commentController");
const {
  validate,
  commentInputValidator,
} = require("../middlewares/inputValidation");
const { validateToken } = require("../middlewares/userValidation");

const router = express.Router();

router.post(
  "/new",
  validate(commentInputValidator),
  validateToken,
  commentController.addComment
);
router.delete(
  "/:id",
  validateId,
  validateToken,
  commentController.deleteComment
);

module.exports = router;
