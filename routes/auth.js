const express = require("express");

const checkToken = require("../middleware/tokenValidation");
const checkUser = require("../middleware/userValidation");
const {
  postLogin,
  postLogout,
  postSignUp,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", checkUser, checkToken, postLogin);
router.post("/logout", postLogout);
router.post("/sign-up", postSignUp);

module.exports = router;
