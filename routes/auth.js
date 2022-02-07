const express = require("express");

const {
  validate,
  signUpInputValidators,
} = require("../middlewares/userInputValidation");

const {
  validateUser,
  validateToken,
} = require("../middlewares/userValidation");

const {
  postLogin,
  postLogout,
  postSignUp,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", validateUser, validateToken, postLogin);
router.post("/logout", postLogout);
router.post("/sign-up", validate(signUpInputValidators), postSignUp);

module.exports = router;
