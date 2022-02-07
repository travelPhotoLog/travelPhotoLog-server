const express = require("express");

const { validateToken } = require("../middlewares/userValidation");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/:id/maps", validateToken, userController.getUserMaps);

module.exports = router;
