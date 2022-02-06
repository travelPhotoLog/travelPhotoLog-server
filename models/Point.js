const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
    min: [-90, "Latitude cannot be less than -90."],
    max: [90, "Latitude cannot be greater than 90."],
  },
  longitude: {
    type: Number,
    required: true,
    min: [-180, "Longitude cannot be less than -180."],
    max: [180, "Longitude cannot be greater than 180."],
  },
  placeName: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
    },
  ],
});

module.exports = mongoose.model("Point", PointSchema);
