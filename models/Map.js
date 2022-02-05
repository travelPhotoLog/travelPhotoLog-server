const mongoose = require("mongoose");
const { isEmail } = require("validator");

const MapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  members: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  points: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Point"
  },
  invitationList: [
    {
      type: String,
      validate: [isEmail, "Must be a valid Email."]
    }
  ],
  photos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo"
  }
});

module.exports = mongoose.model("Map", MapSchema);
