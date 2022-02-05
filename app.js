require("dotenv").config();

const express = require("express");
const createError = require("http-errors");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const MESSAGE = require("./constant");
const auth = require("./routes/auth");

const app = express();

mongoose.connect(process.env.MONGODB_URL).catch(error => {
  console.log(`🔴 Connection error.. with [${error}]`);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", auth);

app.use((req, res, next) => {
  next(createError(404, MESSAGE.NOT_FOUNT));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
