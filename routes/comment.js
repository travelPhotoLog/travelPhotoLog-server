const express = require("express");

const commentController = require("../controllers/commentController");

const router = express.Router();

router.post("/new", commentController.addComment);

module.exports = router;
