const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
  },
  createdBy: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: [50, "Please write in 50 characters or less."],
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
