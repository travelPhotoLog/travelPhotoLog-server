const express = require("express");

const commentController = require("../controllers/commentController");

const router = express.Router();

router.delete("/:id", commentController.deleteComment);

module.exports = router;
