const Posting = require("../models/Posting");
const User = require("../models/User");

const { PAGE_SIZE, ERROR_MESSAGE } = require("../constants");

const getPostings = async (req, res, next) => {
  const pageNum = parseInt(req.query.page, 10);
  const pageSize = PAGE_SIZE;

  try {
    if (!pageNum) {
      throw new Error(ERROR_MESSAGE.BAD_REQUEST);
    }

    const totalCount = await Posting.countDocuments();
    const postings = await Posting.find()
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageNum - 1))
      .limit(pageSize)
      .lean()
      .exec();

    res.header("Access-Control-Allow-Origin", "https://travel-photo-log.com");

    res.json({
      postings,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
    });
  } catch (error) {
    console.log(error);
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

const getPostingDetail = async (req, res, next) => {
  const { id: postingId } = req.params;

  try {
    const posting = await Posting.findById(postingId).lean().exec();

    res.json({
      posting,
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

const updatePosting = async (req, res, next) => {
  const { id: postingId } = req.params;
  const { posting } = req.body;

  const { title, content, hashtags, regions, logOption } = posting;

  try {
    await Posting.updateOne(
      { _id: postingId },
      {
        title,
        content,
        hashtags,
        regions,
        logOption,
      }
    );

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

const deletePosting = async (req, res, next) => {
  const { id: postingId } = req.params;
  const userId = req.query.user;

  try {
    await Promise.all([
      User.updateOne({ _id: userId }, { $pull: { myPostings: postingId } }),
      Posting.deleteOne({ _id: postingId }),
    ]);

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

exports.getPostings = getPostings;
exports.getPostingDetail = getPostingDetail;
exports.createPosting = createPosting;
exports.updatePosting = updatePosting;
exports.deletePosting = deletePosting;
exports.searchPostings = searchPostings;
