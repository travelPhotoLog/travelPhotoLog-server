const mongoose = require("mongoose");

const PostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default:
      "https://travelphotolog.s3.ap-northeast-2.amazonaws.com/1644760423718.png",
  },
  hashtags: [
    {
      type: String,
      required: true,
    },
  ],
  regions: [
    {
      type: String,
      required: true,
    },
  ],
  logOption: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Posting", PostingSchema);
