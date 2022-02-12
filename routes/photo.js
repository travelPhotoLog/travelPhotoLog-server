const express = require("express");

const { uploadServerImg, deleteServerImg } = require("../middlewares/awsS3");
const { validate, photoValidators } = require("../middlewares/inputValidation");

const photoController = require("../controllers/photoController");

const router = express.Router();

router.post(
  "/new",
  uploadServerImg.single("image"),
  // validate(photoValidators),
  photoController.uploadPhoto
);
// router.delete("/:id", deleteServerImg, photoController.deletePhoto);
router.delete("/:id", photoController.deletePhoto);

module.exports = router;
