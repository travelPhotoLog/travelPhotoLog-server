const express = require("express");

const checkToken = require("../middlewares/tokenValidation");
const checkUser = require("../middlewares/userValidation");
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
