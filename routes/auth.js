const express = require("express");

const {
  validate,
  signUpInputValidators,
} = require("../middlewares/inputValidation");

const {
  validateUser,
  validateToken,
} = require("../middlewares/userValidation");

const authController = require("../controllers/authController");

const router = express.Router();

router.post("/auto-login", validateToken, authController.postLogin);
router.post("/login", validateUser, validateToken, authController.postLogin);
router.post("/logout", authController.postLogout);
router.post(
  "/sign-up",
  validate(signUpInputValidators),
  authController.postSignUp
);

module.exports = router;
