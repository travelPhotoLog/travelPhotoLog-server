const express = require("express");

const photoController = require("../controllers/photoController");
const { deleteServerImg } = require("../middlewares/awsS3");

const router = express.Router();

router.delete("/:id", deleteServerImg, photoController.deletePhoto);

module.exports = router;
