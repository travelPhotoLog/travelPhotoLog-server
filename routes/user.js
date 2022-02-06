const express = require("express");

const { getUserMaps } = require("../controllers/user.controller");

const router = express.Router();

router.get("/:id/maps", getUserMaps);

module.exports = router;
