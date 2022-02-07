const express = require("express");

const { validateToken } = require("../middlewares/userValidation");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/:id/maps", validateToken, userController.getUserMaps);

module.exports = router;
