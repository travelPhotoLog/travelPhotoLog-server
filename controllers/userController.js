const User = require("../models/User");
const ERROR_MESSAGE = require("../constants");

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
  const page = parseInt(req.query.page, 10) || 0;
  const pageSize = 8;

  try {
    const { myPostings } = await User.findById(userId)
      .populate("myPostings")
      .select({
        _id: 0,
        myPostings: 1,
      })
      .lean()
      .exec();

    const filteredPostings = myPostings.map(posting => ({
      id: posting._id,
      title: posting.title,
      createdBy: posting.createdBy,
      createdAt: posting.createdAt,
    }));

    const totalCount = myPostings.length;
    const startIndex = totalCount - pageSize * (page - 1);
    const endIndex = totalCount - pageSize * page;

    let postings;

    if (totalCount - pageSize * (page - 1) <= pageSize) {
      postings = filteredPostings.slice(0, startIndex).reverse();
    } else {
      postings = filteredPostings.slice(endIndex, startIndex).reverse();
    }

    res.json({
      postings,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch {
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
