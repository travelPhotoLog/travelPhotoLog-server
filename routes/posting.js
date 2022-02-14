const express = require("express");

const {
  validate,
  postingInputValidators,
} = require("../middlewares/inputValidation");
const { validateId } = require("../middlewares/objectIdValidation");

const postingController = require("../controllers/postingController");

const router = express.Router();

router.get("/", postingController.getPostings);
router.get("/:id", validateId, postingController.getPostingDetail);
router.get("/search", postingController.searchPostings);
router.post(
  "/new",
  validate(postingInputValidators),
  postingController.createPosting
);
router.delete("/:id", validateId, postingController.deletePosting);

module.exports = router;
