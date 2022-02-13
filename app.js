require("dotenv").config();

const path = require("path");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const createError = require("http-errors");
const mongoose = require("mongoose");

const ERROR_MESSAGE = require("./constants");
const auth = require("./routes/auth");
const user = require("./routes/user");
const map = require("./routes/map");
const point = require("./routes/point");
const photo = require("./routes/photo");
const comment = require("./routes/comment");

const app = express();

mongoose.connect(process.env.MONGODB_URL).catch(error => {
  console.log(`🔴 Connection error.. with [${error}]`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", auth);
app.use("/user", user);
app.use("/map", map);
app.use("/point", point);
app.use("/photo", photo);
app.use("/comment", comment);

app.use((req, res, next) => {
  next(createError(404, ERROR_MESSAGE.NOT_FOUND));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
