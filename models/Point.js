const mongooes = require("mongoose");

const PointSchema = new mongooes.Schema({
  latitude: {
    type: Number,
    required: true,
    min: [-90, "Latitude cannot be less than -90."],
    max: [90, "Latitude cannot be greater than 90."]
  },
  longitude: {
    type: Number,
    required: true,
    min: [-180, "Longitude cannot be less than -180."],
    max: [180, "Longitude cannot be greater than 180."]
  },
  photos: [
    {
      type: mongooes.Schema.Types.ObjectId,
      ref: "Photo"
    }
  ],
  placeName: {
    type: String,
    required: true
  }
});

module.exports = mongooes.model("Point", PointSchema);
