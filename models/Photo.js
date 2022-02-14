const mongoose = require("mongoose");
const { isURL } = require("validator");

const PhotoSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    validate: {
      validator: value => new Date() > value,
      message: "This date is not possible.",
    },
  },
  createdBy: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    validate: [isURL, "Must be a valid URL"],
  },
  placeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  point: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Point",
  },
});

module.exports = mongoose.model("Photo", PhotoSchema);
