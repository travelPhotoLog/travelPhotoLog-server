const express = require("express");

const pointController = require("../controllers/pointController");
const { validateMember } = require("../middlewares/memberValidation");
const { validateToken } = require("../middlewares/userValidation");

const router = express.Router();

router.get("/photos", validateToken, pointController.getPhotos);

module.exports = router;
