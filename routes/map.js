const express = require("express");

const { validateId } = require("../middlewares/objectIdValidation");
const { validateToken } = require("../middlewares/userValidation");
const { validateMember } = require("../middlewares/memberValidation");

const mapController = require("../controllers/mapController");

const router = express.Router();

router.get(
  "/:id/points",
  validateId,
  validateToken,
  validateMember,
  mapController.getMapPoints
);
router.post("/new", mapController.createNewMap);

module.exports = router;
