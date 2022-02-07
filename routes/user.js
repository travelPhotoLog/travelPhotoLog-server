const express = require("express");

const { validateToken } = require("../middlewares/userValidation");
const { getUserMaps } = require("../controllers/user.controller");

const router = express.Router();

router.get("/:id/maps", validateToken, getUserMaps);

module.exports = router;
