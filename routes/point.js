const express = require("express");

const pointController = require("../controllers/pointController");

const router = express.Router();

router.get("/photos", pointController.getPhotos);

module.exports = router;
