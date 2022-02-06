const mongoose = require("mongoose");
const createError = require("http-errors");

const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

const getUserMaps = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (mongoose.isValidObjectId(id)) {
      const error = createError(400, ERROR_MESSAGE.BAD_REQUEST);
      throw error;
    }

    const userMaps = await User.findById(id).populate("myMaps").lean().exec();

    const maps = userMaps.map(map => ({
      id: map._id,
      title: map.title,
    }));

    res.json({ maps });
  } catch (err) {
    if (err.code === 400 && err.message === ERROR_MESSAGE.BAD_REQUEST) {
      res.json({
        error: {
          message: "Bad Request",
          status: 400,
        },
      });

      return;
    }

    res.json({
      error: {
        message: "Server is not stable",
        status: 500,
      },
    });
  }
};

exports.getUserMaps = getUserMaps;
