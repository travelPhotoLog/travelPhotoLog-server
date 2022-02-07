const express = require("express");

const {
  validate,
  signUpInputValidators,
} = require("../middlewares/userInputValidation");

const {
  validateUser,
  validateToken,
} = require("../middlewares/userValidation");

const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", validateUser, validateToken, authController.postLogin);
router.post("/logout", authController.postLogout);
router.post(
  "/sign-up",
  validate(signUpInputValidators),
  authController.postSignUp
);

module.exports = router;
