const express = require("express");

const {
  validate,
  postingInputValidators,
} = require("../middlewares/inputValidation");

const postingController = require("../controllers/postingController");

const router = express.Router();

router.get("/", postingController.getPostings);
router.get("/search", postingController.searchPostings);
router.post(
  "/new",
  validate(postingInputValidators),
  postingController.createPosting
);

module.exports = router;
