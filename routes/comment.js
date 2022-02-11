const express = require("express");

const validateId = require("../middlewares/objectIdValidation");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.delete("/:id", validateId, commentController.deleteComment);

module.exports = router;
