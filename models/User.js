const mongoose = require("mongoose");
const { isEmail, isURL } = require("validator");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Please enter a valid Email"]
  },
  profileUrl: {
    type: String,
    required: true,
    unique: true,
    validate: [isURL, "Must be a valid URL"]
  },
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  occupation: {
    type: String,
    validate: {
      validator: value => {
        const occupationList = [
          "student",
          "officeWorker",
          "houseWife",
          "jobSeeker",
          "etc"
        ];

        return occupationList.includes(value);
      },
      message: "It is invalid occupation"
    }
  },
  birthday: {
    type: Date,
    validate: {
      validator: value => {
        return new Date() > value;
      },
      message: "This date is not possible."
    }
  },
  contact: {
    type: String,
    trim: true,
    minlength: [13, "The phone number must be 13 digits, including '-'."],
    maxlength: [13, "The phone number must be 13 digits, including '-'."]
  },
  myMaps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Map"
    }
  ],
  myPostings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posting"
    }
  ],
  refreshToken: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", UserSchema);
