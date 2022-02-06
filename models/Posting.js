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
    default: new Date(),
  },
  content: {
    type: String,
    required: true,
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
