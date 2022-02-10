const express = require("express");

const pointController = require("../controllers/pointController");
const { validateId } = require("../middlewares/objectIdValidation");

const router = express.Router();

router.get("/:id/photos", validateId, pointController.getPhotos);

module.exports = router;
