require("../models/Posting");
const User = require("../models/User");
const { PAGE_SIZE, ERROR_MESSAGE } = require("../constants");

const getUserMaps = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { myMaps: userMaps } = await User.findById(id)
      .populate("myMaps")
      .lean()
      .exec();

    const maps = userMaps.map(map => ({
      id: map._id,
      title: map.title,
    }));

    res.json({ maps });
  } catch (error) {
    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

const getUserPostings = async (req, res, next) => {
  const { id: userId } = req.params;
  const pageNum = parseInt(req.query.page, 10);
  const pageSize = PAGE_SIZE;

  try {
    if (!pageNum) {
      throw new Error(ERROR_MESSAGE.BAD_REQUEST);
    }

    const { myPostings } = await User.findById(userId)
      .populate({
        path: "myPostings",
        model: "Posting",
        options: {
          sort: { createdAt: -1 },
          skip: pageSize * (pageNum - 1),
          limit: pageSize,
        },
      })
      .lean()
      .exec();

    const totalCount = myPostings.length;

    const postings = myPostings.map(posting => ({
      id: posting._id,
      title: posting.title,
      createdBy: posting.createdBy,
      createdAt: posting.createdAt,
      imageUrl: posting.imageUrl,
    }));

    res.json({
      postings,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
    });
  } catch (error) {
    if (error.message === ERROR_MESSAGE.BAD_REQUEST) {
      res.json({
        error: {
          message: ERROR_MESSAGE.BAD_REQUEST,
          code: 400,
        },
      });

      return;
    }

    res.json({
      error: {
        message: ERROR_MESSAGE.SERVER_ERROR,
        code: 500,
      },
    });
  }
};

exports.getUserPostings = getUserPostings;
exports.getUserMaps = getUserMaps;
