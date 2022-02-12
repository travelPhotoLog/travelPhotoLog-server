const express = require("express");

const photoController = require("../controllers/photoController");
const { deleteServerImg } = require("../middlewares/awsS3");
const { validateId } = require("../middlewares/objectIdValidation");

const router = express.Router();

router.get("/:id", validateId, photoController.getPhoto);
router.delete("/:id", deleteServerImg, photoController.deletePhoto);

module.exports = router;
