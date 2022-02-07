const mongoose = require("mongoose");

const ERROR_MESSAGE = require("../constants");

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.json({
      error: {
        message: ERROR_MESSAGE.BAD_REQUEST,
        status: 400,
      },
    });

    return;
  }

  next();
};

exports.validateId = validateId;
