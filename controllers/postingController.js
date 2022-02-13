const Posting = require("../models/Posting");
const User = require("../models/User");

const { ERROR_MESSAGE } = require("../constants");

const getPostings = async (req, res, next) => {
  let postings;
  const pageSize = 5;
  const page = parseInt(req.query.page, 10) || "0";

  try {
    const countPostings = await Posting.countDocuments({}).exec();
    const totalPostings = await Posting.find({}).exec();
    const startPosting = countPostings - pageSize * (page - 1);
    const endPosting = countPostings - pageSize * page;

    if (countPostings - pageSize * (page - 1) <= pageSize) {
      postings = totalPostings.slice(0, startPosting).reverse();
    } else {
      postings = totalPostings.slice(endPosting, startPosting).reverse();
    }

    res.json({
      postings,
      totalPages: Math.ceil(countPostings / pageSize),
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
  const pageSize = 3;
  const { region, hashtag, page } = req.query;

  let countFilteredPostings;
  let filteredPostings;
  let totalFilteredPostings;

  try {
    if (region && hashtag) {
      [countFilteredPostings, filteredPostings] = await Promise.all([
        Posting.countDocuments({ regions: region, hashtags: hashtag.trim() }),
        Posting.find({ regions: region, hashtags: hashtag.trim() }),
      ]);
    } else if (region && !hashtag) {
      [countFilteredPostings, filteredPostings] = await Promise.all([
        Posting.countDocuments({ regions: region }),
        Posting.find({ regions: region }),
      ]);
    } else {
      [countFilteredPostings, filteredPostings] = await Promise.all([
        Posting.countDocuments({ hashtags: hashtag.trim() }),
        Posting.find({ hashtags: hashtag.trim() }),
      ]);
    }

    const startPosting = countFilteredPostings - pageSize * (page - 1);
    const endPosting = countFilteredPostings - pageSize * page;

    if (countFilteredPostings - pageSize * (page - 1) <= pageSize) {
      totalFilteredPostings = filteredPostings.slice(0, startPosting).reverse();
    } else {
      totalFilteredPostings = filteredPostings
        .slice(endPosting, startPosting)
        .reverse();
    }

    res.json({
      postings: totalFilteredPostings,
      totalPages: Math.ceil(countFilteredPostings / pageSize),
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
