const mongoose = require("mongoose");
const { isEmail } = require("validator");

const MapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  invitationList: [
    {
      email: {
        type: String,
        validate: [isEmail, "Must be a valid Email."],
        required: true,
      },
      token: { type: String, required: true },
    },
  ],
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  points: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Point",
    },
  ],
});

module.exports = mongoose.model("Map", MapSchema);
