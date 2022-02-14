const express = require("express");

const userController = require("../controllers/userController");
const { validateToken } = require("../middlewares/userValidation");
const { validateId } = require("../middlewares/objectIdValidation");

const router = express.Router();

router.get("/:id/maps", validateId, validateToken, userController.getUserMaps);
router.get("/:id/postings", validateId, userController.getUserPostings);

module.exports = router;
