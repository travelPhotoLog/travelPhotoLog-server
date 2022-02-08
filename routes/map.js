const express = require("express");

const { validateToken } = require("../middlewares/userValidation");
const { validateMember } = require("../middlewares/memberValidation");

const mapController = require("../controllers/mapController");

const router = express.Router();

router.get(
  "/:id/points",
  validateToken,
  validateMember,
  mapController.getmapPoints
);

module.exports = router;
