const mongooes = require("mongoose");
const { isURL } = require("validator");

const PhotoSchema = new mongooes.Schema({
  createdAt: {
    type: Date,
    required: true,
    validate: {
      validator: value => {
        return new Date() > value;
      },
      message: "This date is not possible."
    }
  },
  createdBy: {
    type: String,
    require: true
  },
  url: {
    type: String,
    required: true,
    unique: true,
    validate: [isURL, "Must be a valid URL"]
  },
  placeName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  comments: [
    {
      type: mongooes.Schema.Types.ObjectId,
      ref: "Commnet"
    }
  ],
  point: {
    type: mongooes.Schema.Types.ObjectId,
    ref: "Point"
  }
});

module.exports = mongooes.model("Photo", PhotoSchema);
