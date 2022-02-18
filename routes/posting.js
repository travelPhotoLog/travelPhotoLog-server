const express = require("express");

const {
  validate,
  postingInputValidators,
} = require("../middlewares/inputValidation");
const { validateId } = require("../middlewares/objectIdValidation");

const postingController = require("../controllers/postingController");
const { validateToken } = require("../middlewares/userValidation");

const router = express.Router();

router.get("/", postingController.getPostings);
router.get("/search", postingController.searchPostings);
router.get("/:id", validateId, postingController.getPostingDetail);
router.put(
  "/:id",
  validateId,
  validateToken,
  validate(postingInputValidators),
  postingController.updatePosting
);
router.delete(
  "/:id",
  validateId,
  validateToken,
  postingController.deletePosting
);

router.post(
  "/new",
  validateToken,
  validate(postingInputValidators),
  postingController.createPosting
);

module.exports = router;
