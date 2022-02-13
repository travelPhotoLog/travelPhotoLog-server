const Posting = require("../models/Posting");
const User = require("../models/User");

const { ERROR_MESSAGE } = require("../constants");

const getPostings = async (req, res, next) => {
  let postings;
  const pageSize = 8;
  const page = parseInt(req.query.page, 10) || "0";

  try {
    const postingCount = await Posting.countDocuments({}).exec();
    const totalPostings = await Posting.find({}).exec();
    const startIndex = postingCount - pageSize * (page - 1);
    const endIndex = postingCount - pageSize * page;

    if (postingCount - pageSize * (page - 1) <= pageSize) {
      postings = totalPostings.slice(0, startIndex).reverse();
    } else {
      postings = totalPostings.slice(endIndex, startIndex).reverse();
    }

    res.json({
      postings,
      totalPages: Math.ceil(postingCount / pageSize),
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

const searchPostings = async (req, res, next) => {
  const pageSize = 8;
  const { region, hashtag, page } = req.query;

  let filteredPostingCount;
  let filteredPostings;
  let totalFilteredPostings;

  try {
    if (region && hashtag) {
      [filteredPostingCount, filteredPostings] = await Promise.all([
        Posting.countDocuments({ regions: region, hashtags: hashtag.trim() }),
        Posting.find({ regions: region, hashtags: hashtag.trim() }),
      ]);
    } else if (region && !hashtag) {
      [filteredPostingCount, filteredPostings] = await Promise.all([
        Posting.countDocuments({ regions: region }),
        Posting.find({ regions: region }),
      ]);
    } else {
      [filteredPostingCount, filteredPostings] = await Promise.all([
        Posting.countDocuments({ hashtags: hashtag.trim() }),
        Posting.find({ hashtags: hashtag.trim() }),
      ]);
    }

    const startIndex = filteredPostingCount - pageSize * (page - 1);
    const endIndex = filteredPostingCount - pageSize * page;

    if (filteredPostingCount - pageSize * (page - 1) <= pageSize) {
      totalFilteredPostings = filteredPostings.slice(0, startIndex).reverse();
    } else {
      totalFilteredPostings = filteredPostings
        .slice(endIndex, startIndex)
        .reverse();
    }

    res.json({
      postings: totalFilteredPostings,
      totalPages: Math.ceil(filteredPostingCount / pageSize),
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

const createPosting = async (req, res, next) => {
  const { posting, user: userId } = req.body;

  try {
    const newPosting = await new Posting(posting);
    const currentUser = await User.findById(userId).exec();

    const newPostingId = newPosting._id;
    currentUser.myPostings.push(newPostingId);

    await Promise.all([currentUser.save(), newPosting.save()]);

    res.json({
      result: "ok",
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

exports.getPostings = getPostings;
exports.searchPostings = searchPostings;
exports.createPosting = createPosting;
